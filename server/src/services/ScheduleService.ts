import { Types } from "mongoose";
import AccountRepository from '../database/AccountDal'
import ScheduleRepository from '../database/ScheduleDal'


export const getSchedule = async (accountID: string, date: number) => {
    return await ScheduleRepository.getOrCreateWeeklySchedule(accountID as unknown as Types.ObjectId, date);
};



export const makeAppointment = async (slotID: string, clientEmail: string, businessEmail: string) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    const business = await (AccountRepository.getUserByEmail(businessEmail));
    const businessID = business?._id as unknown as Types.ObjectId;
    const slotIDObjectId = slotID as unknown as Types.ObjectId;
    return await ScheduleRepository.makeAppointment(slotIDObjectId, clientID, businessID);
};

export const getAppointmentsForClient = async (clientEmail: string) => {
    const client = await (AccountRepository.getUserByEmail(clientEmail));
    const clientID = client?._id as unknown as Types.ObjectId;
    return await ScheduleRepository.getAppointmentsForClient(clientID);

}