import { Types } from "mongoose";
import AccountRepository from '../database/AccountDal'
import AppointmentRepository from '../database/AppointmentDal'
import { IAppointment } from "../models/Appointment";
import sendEmail from './EmailService';

export const makeAppointment = async (slotID: string, clientEmail: string, businessEmail: string) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    const business = await (AccountRepository.getUserByEmail(businessEmail));
    const businessID = business?._id as unknown as Types.ObjectId;
    const slotObjectID = slotID as unknown as Types.ObjectId;
    const newAppointmentDetails = await AppointmentRepository.makeAppointment(slotObjectID, clientID, businessID);
    await sendEmail(newAppointmentDetails);
    return newAppointmentDetails;
}

export const getAppointments = async (userEmail: string, userType: string = 'client', skip: number, limit: number, date?: number) => {
    const user = await (AccountRepository.getUserByEmail(userEmail));
    const userID = user?._id as unknown as Types.ObjectId;
    return await AppointmentRepository.getAppointments(userID, skip, limit, userType, date);
}

export const getAppointmentsCount = async (clientEmail: string, userType: string = 'client', date?: number) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    return await AppointmentRepository.getAppointmensCount(clientID, userType, date);
}

export const cancelAppointment = async (appointmentId: string, sender: string) => {
    const cancelDetails: EmailDetails = await AppointmentRepository.cancelAppointment(appointmentId as unknown as Types.ObjectId, sender);
    await sendEmail(cancelDetails);
    return cancelDetails;
}

export const rescheduleAppointment = async (appointment: IAppointment, slotID: string, sender: string) => {
    try {
        const clientID = appointment.client as unknown as Types.ObjectId;
        const businessID = appointment.business as unknown as Types.ObjectId;
        
        const cancel: EmailDetails = await AppointmentRepository.cancelAppointment(appointment._id as unknown as Types.ObjectId, sender);
        const reschedule = await AppointmentRepository.makeAppointment(slotID as unknown as Types.ObjectId, clientID, businessID);


        const emailDetails: EmailDetails = {
            subject: "Appointment reschedule",
            initiator: cancel?.initiator,
            sendEmailTo: cancel?.sendEmailTo,
            originalTime: cancel?.originalTime,
            newTime: reschedule?.originalTime
        }

        await sendEmail(emailDetails);

        return reschedule;
    } catch (error) {
        console.error('Error in rescheduleAppointment:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};