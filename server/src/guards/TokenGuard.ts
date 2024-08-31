import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecretKey = process.env.TOKEN_SECRET;

if (!jwtSecretKey) {
    throw new Error("TOKEN_SECRET environment variable is not set");
}

const tokenGuard = (req: Request, res: Response, next: NextFunction): void => {
    const { token } = req.cookies;
    
    if (!token) {
        res.status(401).json({ message: 'Authentication error: Token missing' });
        return;
    }

    try {
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            next();
        } else {
            res.status(401).json({ message: 'Authentication error: Invalid token' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Authentication error: Invalid token' });
    }
};

export default tokenGuard;