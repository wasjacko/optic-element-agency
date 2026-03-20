import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access Denied: Missing or invalid token" });
        }

        const token = authHeader.split(' ')[1];
        

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'oe-agency-super-secure-key-2026') as any;
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Access Forbidden: Not an admin" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Access Denied: Invalid or expired token" });
    }
};
