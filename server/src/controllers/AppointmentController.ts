import { Request, Response } from 'express';
import {
    makeAppointment,
    getAppointments,
    getAppointmentsCount,
    cancelAppointment,
    rescheduleAppointment
} from '../services/AppointmentService';
import { IAppointment } from '../models/Appointment';

function parseJwt(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const GetAppointments = async (req: Request, res: Response) => {
    const { userEmail, userType, skip, limit, date } = req.query;
    if (!userEmail || !userType) {
        return res.status(400).send('Invalid user info');
    }
    if (!skip || !limit) {
        return res.status(400).send('Wrong pagination parameters');
    }
    let appointments;
    try {
        if (!date) {
            appointments = await getAppointments(String(userEmail), String(userType), Number(skip), Number(limit))
        } else {
            appointments = await getAppointments(String(userEmail), String(userType), Number(skip), Number(limit), Number(date));
        }

        res.status(200).json(appointments);
    } catch (err) {
        console.error('Error getting appointments:', err);
        res.status(500).send('Failed to get appointments');
    }
}

export const GetAppointmentsTotalCount = async (req: Request, res: Response) => {
    const { userEmail, userType, date } = req.query;
    if (!userEmail || !userType) {
        return res.status(400).send('Invalid user info');
    }
    try {
        res.status(200).json(await getAppointmentsCount(String(userEmail), String(userType), Number(date)));
    } catch (err) {
        console.error('Error getting appointments:', err);
        res.status(500).send('Failed to get appointments');
    }
}
export const MakeAppointment = async (req: Request, res: Response) => {
    const { slotID, clientEmail, businessEmail } = req.body;
    if (!slotID || !clientEmail || !businessEmail) {
        return res.status(400).send('Invalid slotID or emails');
    }
    try {
        const appointment = await makeAppointment(String(slotID), String(clientEmail), String(businessEmail));
        //sendEmail("New appointment", businessEmail, client.name, appointment?.time!);
        res.status(204).json(appointment);
    } catch (err) {
        console.error('Error making appointment:', err);
        res.status(500).send('Error making appointment');
    }
}

export const CancelAppointment = async (req: Request, res: Response) => {
    const { token } = req.cookies;
    const { appointmentId } = req.query;
    const sender = parseJwt(token);
    const { email } = sender;

    if (!appointmentId) {
        return res.status(400).send('Invalid appointment Id');
    }
    try {
        const time = await cancelAppointment(String(appointmentId), email);
        res.status(200).json(time);
    } catch (err) {
        console.error('Error getting schedule:', err);
        res.status(500).send('Failed to get schedule');
    }
}

export const RescheduleAppointment = async (req: Request, res: Response) => {
    const { token } = req.cookies;
    const { oldAppointment, newSlotId } = req.body;
    const sender = parseJwt(token);
    const { email } = sender;
    if (!oldAppointment || !newSlotId) {
        return res.status(400).send('Invalid old appointment or new slot');
    }
    try {
        res.status(200).json(await rescheduleAppointment(oldAppointment as IAppointment, String(newSlotId), email));
    } catch (err) {
        console.error('Error getting schedule:', err);
        res.status(500).send('Failed to get schedule');
    }
}