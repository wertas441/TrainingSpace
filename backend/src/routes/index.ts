import { Router } from 'express';
import { ApiResponse } from '../types';

const router = Router();

router.get('/health', (req, res) => {
    const response: ApiResponse = {
        success: true,
        message: 'API работает корректно',
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        }
    };
    res.json(response);
});

export default router;
