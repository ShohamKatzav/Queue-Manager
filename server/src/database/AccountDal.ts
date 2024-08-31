import Account from "../models/Account";
import ScheduleRepository from "./ScheduleDal";
import { Types } from "mongoose";

type BusinessQuery = {
    userType: 'business';
    name?: RegExp;
    city?: RegExp;
};

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
    static async getBusinesses(skip: number, limit: number) {
        try {
            return await Account.find({
                userType: 'business'
            }).skip(skip).limit(limit).exec();
        } catch (err) {
            throw new Error('Failed to find buisnesses');
        }
    }

    static async getBusinessesCount(searchType?: string, searchParam?: string) {
        try {
            if (!searchType)
                return await Account.countDocuments({ userType: 'business' }).exec();
            else {
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
        } catch (err) {
            throw new Error('Failed to get businesses count');
        }
    }
    static async getBusinessesByLocation(skip: number, limit: number, location: string) {
        try {
            const cityRegex = new RegExp(location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

            return await Account.find({
                userType: 'business',
                city: cityRegex
            }).skip(skip).limit(limit).exec();
        } catch (err) {
            throw new Error('Failed to find buisnesses');
        }
    }
    static async getBusinessesByName(skip: number, limit: number, name: string) {
        try {
            const nameRegex = new RegExp(name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            return await Account.find({
                userType: 'business',
                name: nameRegex
            }).skip(skip).limit(limit).exec();
        } catch (err) {
            throw new Error('Failed to find buisnesses');
        }
    }
    static async addUser(name: string, email: string, city: string, address: string, userType: string, hash: string, schedule: ScheduleDTO) {
        try {
            const account = await Account.create({ email, password: hash, userType, name, city, address });
            if (schedule.week.length) {
                const scheduleWithAccountId = { ...schedule, accountID: account._id as string }
                const scheduleID = await ScheduleRepository.createBaseSchedule(scheduleWithAccountId);
                account.baseSchedule = scheduleID as Types.ObjectId;
                await account.save();
            }
            return account._id;
        } catch (err) {
            throw new Error('Failed to create user');
        }
    }
}