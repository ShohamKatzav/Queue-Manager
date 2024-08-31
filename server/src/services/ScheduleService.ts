import { Types } from "mongoose";
import ScheduleRepository from '../database/ScheduleDal'


export const getSchedule = async (accountID: string, date: number) => {
    return await ScheduleRepository.getOrCreateWeeklySchedule(accountID as unknown as Types.ObjectId, date);
}
