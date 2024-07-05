import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecretKey = process.env.TOKEN_SECRET;

if (!jwtSecretKey) {
    throw new Error("TOKEN_SECRET environment variable is not set");
}

const guard = (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
        return response.status(401).json({ error: 'Authentication error: Token missing' });
    }

    const authToken = authHeader.split(' ')[1];
    
    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        if (verified) {
            next();
        } else {
            return response.status(401).json({ error: 'Authentication error: Invalid token' });
        }
    } catch (error) {
        return response.status(401).json({ error: 'Authentication error: Invalid token' });
    }
};

export default guard;