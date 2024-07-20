import { Request } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecretKey = process.env.TOKEN_SECRET;

if (!jwtSecretKey) {
    throw new Error("TOKEN_SECRET environment variable is not set");
}

const guard = (request: Request): boolean => {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
        // 'Authentication error: Token missing'
        return false;
    }

    const authToken = authHeader.split(' ')[1];
    
    try {
        const verified = jwt.verify(authToken, jwtSecretKey);
        if (verified) {
            return true;
        } else {
            // 'Authentication error: Invalid token'
            return false;
        }
    } catch (error) {
        // // 'Authentication error: Invalid token'
        return false;
    }
};

export default guard;