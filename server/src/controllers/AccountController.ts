import { Request, Response } from 'express';
import guard from '../guards/TokenGuard'
import {
    authOrCreate,
    doesAccountExist,
    getBuisnesses
} from '../services/AccountService';

// An endpoint to see if there's an existing account for a given email address
export const DoesAccountExists = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const user = await doesAccountExist(email);
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to determine whether the user exist:', err);
        res.status(500).send('Failed to determine whether the user exist');
    }
}

export const Auth = async (req: Request, res: Response) => {
    const { name, email, password, city, address, userType, schedule } = req.body;
    try {
        const authResult = await authOrCreate(name, email, password, city, address, userType, schedule);
        authResult?.code == 200 || 201 ?
            res.status(authResult?.code!).json(authResult?.token) :
            res.sendStatus(authResult?.code!);
    } catch (err) {
        console.error('Failed to Auth:', err);
        res.status(500).send('Failed to Auth');
    }
}

// The verify endpoint that checks if a given JWT token is valid
export const Verify = (req: Request, res: Response) => {
    if (guard(req))
        res.sendStatus(200);
    else
        res.sendStatus(401);
}

export const GetBuisnesses = async (req: Request, res: Response) => {
    if (guard(req)) {
        const { skip, limit } = req.query;
        try {
            res.send(await getBuisnesses(Number(skip), Number(limit)));
        } catch (err) {
            console.error('Failed to find buisnesses:', err);
            res.status(500).send('Failed to find buisnesses');
        }
    }
    else
        res.sendStatus(401);
}
