import DailySchedule, { IDailySchedule, ITimeSlot } from '../models/DailySchedule';
import BaseSchedule from "../models/BaseSchedule";
import { Types } from "mongoose";
import Account from "../models/Account";

const lockMap: { [key: string]: boolean } = {};
const getISODate = (date: Date) => date.toISOString().split('T')[0];

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

      const { schedules: newSchedulesArray } = await ScheduleRepository.createMissingSchedules(
        accountID,
        uniqueWorkingDates,
        existingSchedules,
        week,
        appointmentLength
      );
      
      const allSchedules = [...existingSchedules, ...newSchedulesArray].sort((a, b) => a.date.getTime() - b.date.getTime());
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
        const localDate = new Date(date.toLocaleDateString('en-US', { timeZone: 'Asia/Jerusalem' }));
        workingDates.push(new Date(localDate));
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

  static async createMissingSchedules(
    accountID: Types.ObjectId,
    uniqueWorkingDates: Date[],
    existingSchedules: any[],
    week: { day: string, startingTime: string, endingTime: string }[],
    appointmentLength: number
  ) {
    const existingDates = new Set(existingSchedules.map(schedule => getISODate(schedule.date)));
    const datesToCreate = uniqueWorkingDates.filter(date => !existingDates.has(getISODate(date)));
  
    const newSchedules: IDailySchedule[] = [];
    let nextAvailableDay: Date | null = null;
  
    for (const date of datesToCreate) {
      const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Jerusalem' }).format(date);
      const dayConfig = week.find(day => day.day === dayOfWeek);
  
      if (!dayConfig) {
        if (!nextAvailableDay) {
          nextAvailableDay = date;
        }
        continue;
      }
  
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
  
      try {
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
      } catch (error) {
        console.error(`Error creating schedule for ${date}:`, error);
        // Handle error as needed
      }
  
      nextAvailableDay = null;
    }
  
    return {
      schedules: newSchedules,
      nextAvailableDay,
    };
  }

}
