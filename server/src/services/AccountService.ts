import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AccountRepository from '../database/AccountDal'

const jwtSecretKey = process.env.TOKEN_SECRET as string;

export const authOrCreate = async (name: string, email: string, password: string, city: string, address: string, userType: string, schedule: ScheduleDTO) => {
    try {
        const user = await AccountRepository.getUserByEmail(email)

        // If found, compare the hashed passwords and generate the JWT token for the user
        if (user !== null) {
            const result = await bcrypt.compare(password, user.password);
            if (!result) {
                return { code: 401 };
            } else {
                let loginData = {
                    email,
                    signInTime: Date.now(),
                };
                const token = jwt.sign(loginData, jwtSecretKey);
                return { code: 200, token };
            }
            // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
        } else if (user === null) {
            const hash = await bcrypt.hash(password, 10);
            try {
                await AccountRepository.addUser(name, email, city, address, userType, hash, schedule);
            } catch (err) {
                return { code: 500 };
            }

            let loginData = {
                email,
                signInTime: Date.now(),
            };

            const token = jwt.sign(loginData, jwtSecretKey);
            return { code: 201, token };
        }
    } catch (err) {
        console.error('Error in authOrCreate:', err);
        return { code: 500 };
    }
}

export const doesAccountExist = async (email: string) => {
    const account = await AccountRepository.getUserByEmail(email);
    return account !== null;
};

export const getBuisnesses = async (skip: number, limit: number = 5) => {
    return await AccountRepository.getBuisnesses(skip, limit);
};

