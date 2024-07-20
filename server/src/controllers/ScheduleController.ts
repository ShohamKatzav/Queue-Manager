import { Request, Response } from 'express';
import guard from '../guards/TokenGuard'
import {
    getSchedule,
    makeAppointment,
    getAppointmentsForClient
} from '../services/ScheduleService';


export const GetSchedule = async (req: Request, res: Response) => {
    if (guard(req)) {
        const { businessID, date } = req.query;
        if (!businessID || !date || isNaN(Number(date))) {
            return res.status(400).send('Invalid businessID or date');
        }
        try {
            res.status(200).json(await getSchedule(String(businessID), Number(date)));
        } catch (err) {
            console.error('Error getting schedule:', err);
            res.status(500).send('Failed to get schedule');
        }
    }
    else
        res.sendStatus(401);
}

export const MakeAppointment = async (req: Request, res: Response) => {
    if (guard(req)) {
        const { slotID, clientEmail, businessEmail } = req.body;
        if (!slotID || !clientEmail || !businessEmail) {
            return res.status(400).send('Invalid slotID or emails');
        }
        try {
            res.status(204).json(await makeAppointment(String(slotID), String(clientEmail), String(businessEmail)));
        } catch (err) {
            console.error('Error making appointment:', err);
            res.status(500).send('Error making appointment');
        }
    }
    else
        res.sendStatus(401);
}


export const GetAppointmentsForClient = async (req: Request, res: Response) => {
    if (guard(req)) {
        const { clientEmail } = req.query;
        if (!clientEmail) {
            return res.status(400).send('Invalid user email');
        }
        try {
            res.status(200).json(await getAppointmentsForClient(String(clientEmail)));
        } catch (err) {
            console.error('Error getting schedule:', err);
            res.status(500).send('Failed to get schedule');
        }
    }
    else
        res.sendStatus(401);
}