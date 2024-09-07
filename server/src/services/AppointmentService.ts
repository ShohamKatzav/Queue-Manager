import { Types } from "mongoose";
import AccountRepository from '../database/AccountDal'
import AppointmentRepository from '../database/AppointmentDal'
import { IAppointment } from "../models/Appointment";
import sendEmail from './EmailService';
import { IAccount } from "../models/Account";


export const getAppointments = async (userEmail: string, userType: string = 'client', skip: number, limit: number, date?: number) => {
    const user = await (AccountRepository.getUserByEmail(userEmail));
    const userID = user?._id as Types.ObjectId;
    return await AppointmentRepository.getAppointments(userID, skip, limit, userType, date);
}

export const getAppointmentsCount = async (clientEmail: string, userType: string = 'client', date?: number) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as Types.ObjectId;
    return await AppointmentRepository.getAppointmensCount(clientID, userType, date);
}

export const getScheduledDaysInMonth = async (clientEmail: string, year: number, month: number) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as Types.ObjectId;
    return await (AppointmentRepository.getScheduledDaysInMonth(clientID, year, month));
}

export const makeAppointment = async (slotID: string, clientEmail: string, businessEmail: string) => {
    const client = await AccountRepository.getUserByEmail(clientEmail);
    const business = await AccountRepository.getUserByEmail(businessEmail);

    const slotObjectID = new Types.ObjectId(slotID);

    if (!client || !business) {
        throw new Error('Client or business not found');
    }

    const appointment = await AppointmentRepository.makeAppointment(
        slotObjectID,
        client._id as Types.ObjectId,
        business._id as Types.ObjectId
    );

    const newAppointmentDetails = {
        subject: "New appointment at " + business.name,
        initiator: client.name,
        sendEmailTo: business.email,
        originalTime: appointment?.time,
    };

    await sendEmail(newAppointmentDetails);
    return appointment;
}

const getInitiatorDetails = (appointment: IAppointment, sender: string) => {
    const client = appointment.client as unknown as IAccount;
    const business = appointment.business as unknown as IAccount;
    if (!client || !client.email || !business || !business.email) {
        throw new Error('Client or business information is missing');
    }
    const sendEmailTo = sender === client.email ? business.email : client.email;
    const initiator = sender === client.email ? client.name : business.name;

    return {
        business: business.name,
        initiator,
        sendEmailTo
    }
}
export const cancelAppointment = async (appointmentId: string, sender: string) => {
    const appointment = await AppointmentRepository.cancelAppointment(appointmentId as unknown as Types.ObjectId);
    const initiatorDetails = getInitiatorDetails(appointment, sender);

    const cancelAppointmentDetails = {
        subject: "Appointment canceled at " + initiatorDetails.business,
        initiator: initiatorDetails.initiator,
        sendEmailTo: initiatorDetails.sendEmailTo,
        originalTime: appointment.time,
    };
    await sendEmail(cancelAppointmentDetails);
}

export const rescheduleAppointment = async (appointment: IAppointment, slotID: string, sender: string) => {
    try {
        const clientID = appointment.client as Types.ObjectId;
        const businessID = appointment.business as Types.ObjectId;

        const cancelAppointment = await AppointmentRepository.cancelAppointment(appointment._id as unknown as Types.ObjectId);
        const rescheduledAppointment = await AppointmentRepository.makeAppointment(slotID as unknown as Types.ObjectId, clientID, businessID);

        const initiatorDetails = getInitiatorDetails(cancelAppointment, sender);

        const rescheduledAppointmentDetails: EmailDetails = {
            subject: "Appointment reschedule at " + initiatorDetails.business,
            initiator: initiatorDetails.initiator,
            sendEmailTo: initiatorDetails.sendEmailTo,
            originalTime: new Date(appointment?.time),
            newTime: rescheduledAppointment?.time
        }

        await sendEmail(rescheduledAppointmentDetails);

        return rescheduledAppointment;
    } catch (error) {
        console.error('Error in rescheduleAppointment:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};