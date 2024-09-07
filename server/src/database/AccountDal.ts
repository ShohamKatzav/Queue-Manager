import Account from "../models/Account";
import ScheduleRepository from "./ScheduleDal";
import { ObjectId, Types } from "mongoose";

type BusinessQuery = {
    userType: 'business';
    name?: RegExp;
    city?: RegExp;
};

export default class AccountRepository {

    static async getUserByEmail(email: string) {
        try {
            // This Regex for email which: 
            // a - Start with email
            // b - End with email
            // c - Case-insensitive
            return await Account.findOne({
                email: { $regex: new RegExp("^" + email + "$", "i") }
            }).exec();
        } catch (err: any) {
            throw new Error('Failed to find user by email ' + err.message);
        }
    }
    static async getUserIDByEmail(email: string) {
        try {
            const user = await Account.findOne(
                { email: { $regex: new RegExp("^" + email + "$", "i") } },
                { _id: 1 } 
            ).exec();
    
            return user?._id as unknown as ObjectId;
        } catch (err: any) {
            throw new Error('Failed to find user by email ' + err.message);
        }
    }
    static async getBusinesses(skip: number, limit: number) {
        try {
            return await Account.find({
                userType: 'business'
            }).skip(skip).limit(limit).exec();
        } catch (err: any) {
            throw new Error('Failed to find buisnesses ' + err.message);
        }
    }

    static async getBusinessesCount(searchType?: string, searchParam?: string) {
        try {
            if (!searchType)
                return await Account.countDocuments({ userType: 'business' }).exec();
            else {
                // This regex for search parameters:
                // a - Removes any leading and trailing whitespace from the search parameter.
                // b - Escapes any special characters in the search parameter by prefixing them with a backslash.
                // c - Makes the regex case-insensitive.
                const paramRegex = new RegExp(searchParam!.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                const query: BusinessQuery = { userType: 'business' };

                if (searchType === 'name') {
                    query.name = paramRegex;
                } else if (searchType === 'location') {
                    query.city = paramRegex;
                } else {
                    throw new Error('Invalid searchType');
                }

                return await Account.countDocuments(query).exec();
            }
        } catch (err: any) {
            throw new Error('Failed to get businesses count ' + err.message);
        }
    }
    static async getBusinessesByLocation(skip: number, limit: number, location: string) {
        try {
            const cityRegex = new RegExp(location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

            return await Account.find({
                userType: 'business',
                city: cityRegex
            }).skip(skip).limit(limit).exec();
        } catch (err: any) {
            throw new Error('Failed to find buisnesses ' + err.message);
        }
    }
    static async getBusinessesByName(skip: number, limit: number, name: string) {
        try {
            const nameRegex = new RegExp(name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            return await Account.find({
                userType: 'business',
                name: nameRegex
            }).skip(skip).limit(limit).exec();
        } catch (err: any) {
            throw new Error('Failed to find buisnesses ' + err.message);
        }
    }
    static async addUser(name: string, email: string, city: string, address: string, phone: string, userType: string, hash: string, schedule: ScheduleDTO) {
        try {
            const account = await Account.create({ email, password: hash, userType, name, city, address, phone });
            if (schedule.week.length) {
                const scheduleWithAccountId = { ...schedule, accountID: account._id as string }
                const scheduleID = await ScheduleRepository.createBaseSchedule(scheduleWithAccountId);
                account.baseSchedule = scheduleID as Types.ObjectId;
                await account.save();
            }
            else if (userType === 'business') {
                throw new Error('Could not create business account without availability');
            }
            return account._id;
        } catch (err: any) {
            throw new Error('Failed to create user ' + err.message);
        }
    }
}