import { Request } from 'express';
import jwt from 'jsonwebtoken';


const jwtSecretKey = process.env.TOKEN_SECRET;

if (!jwtSecretKey) {
    throw new Error("TOKEN_SECRET environment variable is not set");
}

const guard = (request: Request): boolean => {
    const { token } = request.cookies;
    
    // 'Authentication error: Token missing'
    if (!token) return false;

    try {
        const verified = jwt.verify(token, jwtSecretKey);
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