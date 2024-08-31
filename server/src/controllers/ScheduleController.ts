import { Request, Response } from 'express';
import {
    getSchedule,
} from '../services/ScheduleService';


export const GetSchedule = async (req: Request, res: Response) => {
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
