import Account from "../models/Account";
import ScheduleRepository from "./ScheduleDal";
import { Types } from "mongoose";

export default class AccountRepository {
    static async getUserByEmail(email: string) {
        try {
            return await Account.findOne({
                email: { $regex: new RegExp("^" + email + "$", "i") }
            }).exec();
        } catch (err) {
            throw new Error('Failed to find user by email');
        }
    }
    static async getBuisnesses(skip: number, limit: number) {
        try {
            return await Account.find({
                userType: 'business'
            }).skip(skip).limit(limit).exec();
        } catch (err) {
            throw new Error('Failed to find buisnesses');
        }
    }
    static async addUser(name: string, email: string, city: string, address: string, userType: string, hash: string, schedule: ScheduleDTO) {
        try {
            const account = await Account.create({ email, password: hash, userType, name, city, address });
            const scheduleWithAccountId = {...schedule, accountID: account._id as string}
            const scheduleID = await ScheduleRepository.createBaseSchedule(scheduleWithAccountId);
            account.baseSchedule = scheduleID as Types.ObjectId;
            await account.save();
            return account._id;
        } catch (err) {
            throw new Error('Failed to create user');
        }
    }
}