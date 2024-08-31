import DailySchedule from '../models/DailySchedule';
import { Types } from "mongoose";
import Account, { IAccount } from "../models/Account";
import Appointment from "../models/Appointment";
import { startOfDay, endOfDay } from 'date-fns';

const objectIdEquals = (a: Types.ObjectId, b: Types.ObjectId) => {
    return a.equals(b);
}

export default class AppointmentRepository {


    static async makeAppointment(slotID: Types.ObjectId, clientID: Types.ObjectId, businessID: Types.ObjectId) {
        try {
            const schedule = await DailySchedule.findOne({ 'slots._id': slotID });
            if (schedule) {
                const slot = schedule?.slots?.find(slot => slot._id == slotID);
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

                await appointment.populate('business', '_id email');

                await appointment.populate('client', 'name');

                const populatedBusiness = appointment.business as unknown as IAccount;
                const populatedClient = appointment.client as unknown as IAccount;

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

                return {
                    subject: "New appointment",
                    initiator: populatedClient.name,
                    sendEmailTo: populatedBusiness.email,
                    originalTime: appointment.time,
                    appointment: appointment
                };
            }
        } catch (err) {
            console.error('Error making appointment:', err);
            throw new Error('Error making appointment');
        }
    }

    static async getAppointments(
        userID: Types.ObjectId,
        skip: number,
        limit: number,
        userType: string = "client",
        timestamp?: number,
    ) {
        try {
            const query: any = {};

            if (userType === "client") {
                query.client = userID;
            } else if (userType === "business") {
                query.business = userID;
            }

            // If a timestamp is provided, filter by date
            if (timestamp) {
                const date = new Date(timestamp);
                const start = startOfDay(date);
                const end = endOfDay(date);
                query.time = { $gte: start, $lte: end };
            }

            const appointments = await Appointment.find(query)
                .skip(skip)
                .limit(limit)
                .populate('business', 'name city address')
                .populate('client', 'name')
                .exec();

            return appointments;
        } catch (err) {
            console.error('Error getting appointments:', err);
            throw new Error('Error getting appointments');
        }
    }

    static async getAppointmensCount(userID: Types.ObjectId, userType: string = "client", timestamp?: number) {
        try {
            const query: any = {};
            if (timestamp) {
                const date = new Date(timestamp);
                const start = startOfDay(date);
                const end = endOfDay(date);
                query.time = { $gte: start, $lte: end };
            }

            if (userType === "client") {
                query.client = userID;
            } else if (userType === "business") {
                query.business = userID;
            }

            return await Appointment.countDocuments(query);
        } catch (err) {
            console.error('Error getting appointments:', err);
            throw new Error('Error getting appointments');
        }
    }

    static async cancelAppointment(appointmentID: Types.ObjectId, sender: string) {
        try {
            const appointment = await Appointment.findById(appointmentID)
                .populate('business', 'email name')
                .populate('client', 'email name');

            if (!appointment) {
                throw new Error('Appointment not found');
            }

            const client = appointment.client as unknown as IAccount;
            const business = appointment.business as unknown as IAccount;

            // Ensure client and business are properly populated
            if (!client || !client.email || !business || !business.email) {
                throw new Error('Client or business information is missing');
            }

            const slotID = appointment.slot as Types.ObjectId;
            const schedule = await DailySchedule.findOne({ 'slots._id': slotID });

            if (schedule) {
                const slot = schedule.slots?.find(s => objectIdEquals(s._id as Types.ObjectId, slotID));
                if (slot) {
                    slot.available = true;
                    await schedule.save();
                } else {
                    console.warn('Slot not found in the schedule');
                }
            } else {
                console.warn('Schedule not found for the provided slot ID');
            }

            await Account.updateOne(
                { _id: appointment.client },
                { $pull: { appointments: appointmentID } }
            );

            await Account.updateOne(
                { _id: appointment.business },
                { $pull: { appointments: appointmentID } }
            );

            await Appointment.deleteOne({ _id: appointmentID });

            // Ensure sender matches either client or business email before sending email
            const sendEmailTo = sender === client.email ? business.email : client.email;
            const initiator = sender === client.email ? client.name : business.name;

            if (!sendEmailTo) {
                throw new Error('No valid recipient email found');
            }

            return {
                subject: "Cancel appointment",
                initiator,
                sendEmailTo,
                originalTime: appointment.time,
            };

        } catch (err) {
            console.error('Error canceling appointment:', err);
            throw new Error('Error canceling appointment');
        }
    }

}
