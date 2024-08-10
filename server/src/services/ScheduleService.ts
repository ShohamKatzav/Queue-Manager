import { Types } from "mongoose";
import AccountRepository from '../database/AccountDal'
import ScheduleRepository from '../database/ScheduleDal'
import { IAppointment } from "../models/Appointment";


export const getSchedule = async (accountID: string, date: number) => {
    return await ScheduleRepository.getOrCreateWeeklySchedule(accountID as unknown as Types.ObjectId, date);
}

export const makeAppointment = async (slotID: string, clientEmail: string, businessEmail: string) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    const business = await (AccountRepository.getUserByEmail(businessEmail));
    const businessID = business?._id as unknown as Types.ObjectId;
    const slotObjectID = slotID as unknown as Types.ObjectId;
    return await ScheduleRepository.makeAppointment(slotObjectID, clientID, businessID);
}

export const getAppointmentsForClient = async (clientEmail: string, skip: number, limit: number) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    return await ScheduleRepository.getAppointmentsForClient(clientID, skip, limit);
}

export const getAppointmentsCount = async (clientEmail: string) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    return await ScheduleRepository.getAppointmentsTotalCount(clientID);
}

export const cancelAppointment = async (appointmentId: string) => {
    return await ScheduleRepository.cancelAppointment(appointmentId as unknown as Types.ObjectId);
}

export const rescheduleAppointment = async (appointment: IAppointment, slotID: string) => {
    const clientID = appointment.client as unknown as Types.ObjectId;
    const businessID = appointment.business as unknown as Types.ObjectId;
    await ScheduleRepository.cancelAppointment(appointment._id as unknown as Types.ObjectId);
    return await ScheduleRepository.makeAppointment(slotID as unknown as Types.ObjectId, clientID, businessID);
}