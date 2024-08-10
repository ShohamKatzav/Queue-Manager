import DailySchedule, { IDailySchedule, ITimeSlot } from '../models/DailySchedule';
import BaseSchedule from "../models/BaseSchedule";
import { Types } from "mongoose";
import Account from "../models/Account";
import Appointment from "../models/Appointment";

const lockMap: { [key: string]: boolean } = {};
const getISODate = (date: Date) => date.toISOString().split('T')[0];
const objectIdEquals = (a: Types.ObjectId, b: Types.ObjectId) => {
  return a.equals(b);
}

export default class ScheduleRepository {

  static async createBaseSchedule(scheduleDTO: ScheduleDTO) {
    const { appointmentLength, week, accountID } = scheduleDTO;
    const accountObjectId = new Types.ObjectId(accountID);

    try {
      return (await BaseSchedule.create({
        appointmentLength,
        week,
        account: accountObjectId,
      }))._id;

    } catch (err) {
      console.error('Error creating base schedule:', err);
      throw new Error('Failed to create base schedule');
    }
  };

  static async getOrCreateWeeklySchedule(accountID: Types.ObjectId, date: number) {
    const accountLockKey = accountID.toString();
  
    if (lockMap[accountLockKey]) {
      return;
    }
  
    lockMap[accountLockKey] = true;
  
    try {
      const baseSchedule = await ScheduleRepository.getBaseSchedule(accountID);
      const { appointmentLength, week } = baseSchedule;
  
      const { startingDay, weekLater } = ScheduleRepository.getDateRange(date);
      const uniqueWorkingDates = ScheduleRepository.getUniqueWorkingDates(startingDay, weekLater, week);
      const existingSchedules = await ScheduleRepository.getExistingSchedules(accountID, startingDay, weekLater);
  
      const newSchedules = await ScheduleRepository.createMissingSchedules(accountID, uniqueWorkingDates, existingSchedules, week, appointmentLength);
  
      const allSchedules = [...existingSchedules, ...newSchedules].sort((a, b) => a.date.getTime() - b.date.getTime());
      return allSchedules;
    } catch (err) {
      console.error('Error creating schedule:', err);
      throw new Error('Failed to create schedule');
    } finally {
      delete lockMap[accountLockKey];
    }
  }
  
  static async getBaseSchedule(accountID: Types.ObjectId) {
    const baseSchedule = await BaseSchedule.findOne({ account: accountID });
    if (!baseSchedule) {
      throw new Error('Base schedule not found for the given account');
    }
    return baseSchedule;
  }
  
  static getDateRange(date: number) {
    const startingDay = new Date(date);
    const weekLater = new Date(startingDay);
    weekLater.setDate(startingDay.getDate() + 6);
    return { startingDay, weekLater };
  }
  
  static getUniqueWorkingDates(startingDay: Date, weekLater: Date, week: { day: string, startingTime: string, endingTime: string }[]) {
    const daysOfWeek: { [key: string]: number } = {
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
      Thursday: 4, Friday: 5, Saturday: 6
    };
  
    const workingDates: Date[] = [];
    for (const workingDay of week) {
      const workingDayIndex = daysOfWeek[workingDay.day];
      if (workingDayIndex === undefined) continue;
  
      const firstMatchDate = new Date(startingDay);
      firstMatchDate.setDate(startingDay.getDate() + ((workingDayIndex - startingDay.getDay() + 7) % 7));
  
      for (let date = firstMatchDate; date <= weekLater; date.setDate(date.getDate() + 7)) {
        workingDates.push(new Date(date));
      }
    }
  
    const uniqueWorkingDates = Array.from(new Set(workingDates.map(d => getISODate(d)))).map(dateStr => new Date(dateStr));
    uniqueWorkingDates.sort((a, b) => a.getTime() - b.getTime());
  
    return uniqueWorkingDates;
  }
  
  static async getExistingSchedules(accountID: Types.ObjectId, startingDay: Date, weekLater: Date) {
    return DailySchedule.find({
      account: accountID,
      date: { $gte: getISODate(startingDay), $lte: getISODate(weekLater) },
    }).sort('date');
  }
  
  static async createMissingSchedules(accountID: Types.ObjectId, uniqueWorkingDates: Date[], existingSchedules: any[], week: { day: string, startingTime: string, endingTime: string }[], appointmentLength: number) {
    const existingDates = new Set(existingSchedules.map(schedule => getISODate(schedule.date)));
    const datesToCreate = uniqueWorkingDates.filter(date => !existingDates.has(getISODate(date)));
  
    const newSchedules: IDailySchedule[] = [];
    for (const date of datesToCreate) {
      const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
      const dayConfig = week.find(day => day.day === dayOfWeek);
  
      if (dayConfig) {
        const slots: ITimeSlot[] = [];
        const currentSlotTime = new Date(date);
        const [startHour, startMinute] = dayConfig.startingTime.split(':').map(Number);
        const [endHour, endMinute] = dayConfig.endingTime.split(':').map(Number);
  
        currentSlotTime.setHours(startHour, startMinute);
        const endSlotTime = new Date(currentSlotTime);
        endSlotTime.setHours(endHour, endMinute);
  
        while (currentSlotTime < endSlotTime) {
          const nextSlotTime = new Date(currentSlotTime);
          nextSlotTime.setMinutes(currentSlotTime.getMinutes() + appointmentLength);
  
          if (nextSlotTime > endSlotTime) break;
  
          slots.push({
            start: currentSlotTime.toTimeString().slice(0, 5),
            end: nextSlotTime.toTimeString().slice(0, 5),
            available: true,
          } as ITimeSlot);
  
          currentSlotTime.setTime(nextSlotTime.getTime());
        }
  
        const newDailySchedule = await DailySchedule.create({
          date: new Date(getISODate(date)),
          day: dayConfig.day,
          slots,
          account: accountID,
        });
  
        await Account.updateOne(
          { _id: accountID },
          { $push: { dailySchedules: newDailySchedule._id } },
        );
  
        newSchedules.push(newDailySchedule);
      }
    }
  
    return newSchedules;
  }

  static async makeAppointment(slotID: Types.ObjectId, clientID: Types.ObjectId, businessID: Types.ObjectId) {
    try {
      const schedule = await DailySchedule.findOne({ 'slots._id': slotID });
      if (schedule) {
        const slot = schedule.slots.find(slot => slot._id == slotID);
        if (!slot || !slot.available) {
          throw new Error('Slot is not available');
        }
        const [hours, minutes] = slot.start.split(':').map(Number);
        const appointmentTime = new Date(schedule.date).setHours(hours, minutes);

        const appointment = await Appointment.create({
          client: clientID,
          business: businessID,
          slot: slotID,
          time: appointmentTime
        });

        slot!.available = false
        await schedule?.save();

        // Add the appointment to the client's and business's accounts
        await Account.updateOne(
          { _id: clientID },
          { $push: { appointments: appointment._id } }
        );

        await Account.updateOne(
          { _id: businessID },
          { $push: { appointments: appointment._id } }
        );

        return appointment;
      }
    } catch (err) {
      console.error('Error making appointment:', err);
      throw new Error('Error making appointment');
    }
  }

  static async getAppointmentsForClient(clientID: Types.ObjectId, skip: number, limit: number){
    try {
      const appointments = await Appointment.find({ client: clientID }).skip(skip).limit(limit)
        .populate('business', 'name city address')
        .populate('client', 'name')
        .exec();

      return appointments;
    } catch (err) {
      console.error('Error getting appointments:', err);
      throw new Error('Error getting appointments');
    }
  }

  static async getAppointmentsTotalCount(clientID: Types.ObjectId){
    try {
      return await Appointment.countDocuments({ client: clientID });
    } catch (err) {
      console.error('Error getting appointments:', err);
      throw new Error('Error getting appointments');
    }
  }

  static async cancelAppointment(appointmentID: Types.ObjectId): Promise<void> {

    const appointment = await Appointment.findById(appointmentID);

    if (appointment) {
      const slotID = appointment.slot as unknown as Types.ObjectId;
      const schedule = await DailySchedule.findOne({ 'slots._id': slotID });

      if (schedule) {
        const slot = schedule.slots.find(s => objectIdEquals(s._id as Types.ObjectId, slotID));
        if (slot) {
          slot.available = true;
          await schedule.save();
        }
      }
      await Appointment.deleteOne({ _id: appointmentID });
    }
  }

}
