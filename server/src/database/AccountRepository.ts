import Account from "../models/Account";

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
    static async addUser(email: string, hash: string) {
        try {
            const result = await Account.create({ email, password: hash });
            return result._id;
        } catch (err) {
            throw new Error('Failed to create user');
        }
    }
}