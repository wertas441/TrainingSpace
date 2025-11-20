import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export function authGuard(req: Request, res: Response, next: NextFunction) {

    try {
        const bearer = req.headers.authorization?.replace('Bearer ', '');
        const token = (req as any).cookies?.token || bearer;
        if (!token) return res.status(401).json({ success: false, error: 'Не авторизовано' });

        const payload = jwt.verify(token, config.jwtSecret as string) as { userId: number };
        (req as any).userId = payload.userId;

        next();
    } catch {
        return res.status(401).json({ success: false, error: 'Не авторизовано' });
    }
}
