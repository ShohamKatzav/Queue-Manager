import { Request, Response } from 'express';
import {
    authOrCreate,
    doesAccountExist,
    getBusinesses,
    getBusinessesByName,
    getBusinessesByLocation,
    getBusinessesCount
} from '../services/AccountService';

// An endpoint to see if there's an existing account for a given email address
export const DoesAccountExists = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const user = await doesAccountExist(email);
        res.send(user);
    } catch (err) {
        console.error('Failed to determine whether the user exist:', err);
        res.status(500).send('Failed to determine whether the user exist');
    }
}

export const Auth = async (req: Request, res: Response) => {
    const { name, email, password, city, address, phone, userType, schedule } = req.body;
    try {
        const authResult = await authOrCreate(name, email, password, city, address, phone, userType, schedule);
        if (authResult?.code == 200 || 201) {
            res.cookie('token', authResult?.token, { httpOnly: true });
            res.cookie('userInfo', { _id: authResult?._id, email: email, userType: authResult?.userType }, { httpOnly: false });
            res.sendStatus(authResult?.code!);
        }
        else {
            res.sendStatus(authResult?.code!);
        }
    } catch (err) {
        console.error('Failed to Auth:', err);
        res.status(500).send('Failed to Auth');
    }
}

// The verify endpoint that checks if a given JWT token is valid
export const Verify = (req: Request, res: Response) => {
    res.sendStatus(200);
}

export const GetBusinesses = async (req: Request, res: Response) => {
    const { skip, limit, searchType, searchParam } = req.query;
    try {
        let businesses;

        if (!searchType) {
            businesses = await getBusinesses(Number(skip), Number(limit));
        } else if (searchType === 'name') {
            businesses = await getBusinessesByName(Number(skip), Number(limit), String(searchParam));
        } else if (searchType === 'location') {
            businesses = await getBusinessesByLocation(Number(skip), Number(limit), String(searchParam));
        } else {
            return res.status(400).send('Invalid searchType');
        }

        res.status(200).json(businesses);
    } catch (err) {
        console.error('Failed to find buisnesses:', err);
        res.status(500).send('Failed to find buisnesses');
    }
}

export const GetBusinessesCount = async (req: Request, res: Response): Promise<void> => {
    const { searchType, searchParam } = req.query;

    try {
        const count = searchType
            ? await getBusinessesCount(String(searchType), String(searchParam))
            : await getBusinessesCount();

        res.status(200).json(count);
    } catch (err) {
        console.error('Failed to find businesses:', err);
        res.status(500).send('Failed to find businesses');
    }
};

