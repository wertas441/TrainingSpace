import { Router } from 'express';
import { ApiResponse } from '../types';

const router = Router();

// Базовый роут API
router.get('/', (req, res) => {
    const response: ApiResponse = {
        success: true,
        message: 'Dove Messenger API v1.0.0',
        data: {
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                auth: '/api/auth',
                users: '/api/users',
                messages: '/api/messages',
                chats: '/api/chats'
            }
        }
    };
    res.json(response);
});

// Роут для проверки здоровья API
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
