import { Request, Response } from 'express';
import guard from '../guards/TokenGuard'
import {
    authOrCreate,
    doesAccountExist,
} from '../services/AccountService';

// An endpoint to see if there's an existing account for a given email address
export const DoesAccountExists = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const user = await doesAccountExist(email);
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to determine whether the user exist:', err);
        res.sendStatus(500);
    }
}

export const Auth = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const authResult = await authOrCreate(email, password);
        authResult?.code == 200 || 201 ? 
            res.status(authResult?.code!).json(authResult?.token) :
        res.sendStatus(authResult?.code!);
    } catch (err) {
        console.error('Failed to Auth:', err);
        res.sendStatus(500);
    }
}

// The verify endpoint that checks if a given JWT token is valid
export const Verify = (req: Request, res: Response) => {
    guard(req, res, () => {
        res.sendStatus(200);
    });
}
