import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';
import { userEmailValidator, userNameValidator, userPasswordValidator } from '../lib/backendValidators/indexValidators'
import { UserModel } from '../models/User';
import { config } from '../config';
import { authGuard } from '../middleware/authMiddleware';
import {LoginRequest, RegisterRequest} from "../types/authBackendTypes";
const router = Router();

router.post('/registration', async (req, res) => {
    try {

        const { email, password, userName }: RegisterRequest = req.body;
        const nameValidation = userNameValidator(userName);
        const emailValidation = userEmailValidator(email)
        const passwordValidation = userPasswordValidator(password);

        if (!emailValidation || !passwordValidation || !nameValidation) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка регистрации пользователя, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        // Проверка существования пользователя по email и userName
        const existingByEmail = await UserModel.findByEmail(email);
        if (existingByEmail) {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь с таким email уже существует.'
            };
            return res.status(409).json(response);
        }

        const existingByUserName = await UserModel.findByuserName(userName);
        if (existingByUserName) {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь с таким именем уже существует.'
            };
            return res.status(409).json(response);
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание пользователя в базе данных
        const created = await UserModel.create({ email, userName: userName, password: hashedPassword });

        const user = {
            userName: (created as any).userName,
        };

        const response: ApiResponse = {
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            data: { user }
        };

        res.status(200).json(response);
    } catch (error) {

        console.error('Ошибка регистрации пользователя:', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при регистрации пользователя${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe }: LoginRequest = req.body;
        const emailValidation = userEmailValidator(email)
        const passwordValidation = userPasswordValidator(password);

        if (!emailValidation || !passwordValidation) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка авторизации пользователя, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        // Проверка пользователя в базе данных
        const existingUser = await UserModel.findByEmail(email);
        if (!existingUser) {
            const response: ApiResponse = {
                success: false,
                error: 'Неверный email или пароль.'
            };
            return res.status(401).json(response);
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, (existingUser as any).password);
        if (!isPasswordValid) {
            const response: ApiResponse = {
                success: false,
                error: 'Неверный email или пароль.'
            };
            return res.status(401).json(response);
        }

        // Генерация JWT токена
        const token = jwt.sign({ userId: (existingUser as any).id }, config.jwtSecret as string, {
            expiresIn: rememberMe ? '60d' : '1d'
        });

        // Устанавливаем httpOnly куки с токеном
        res.cookie('token', token, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'lax',
            maxAge: rememberMe ? 60 * 24 * 60 * 60 * 1000 : undefined
        });

        const response: ApiResponse = {
            success: true,
            message: 'Успешный вход в систему',
            data: {
                token
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Ошибка входа в систему:', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при входе в систему${devSuffix}`
        };
        res.status(500).json(response);
    }
});

router.post('/logout', async (req, res) => {
    try {

        const userId = (req as any).userId as string | undefined;

        if (userId) {
            try {
                await (await import('../config/database')).pool.query(
                    'UPDATE users SET last_seen_at = NOW() WHERE id = $1',
                    [userId]
                );
            } catch {/* ignore */
            }
        }

        res.clearCookie('token');

        const response: ApiResponse = {
            success: true,
            message: 'Успешный выход из системы'
        };

        res.json(response);
    } catch (error) {

        console.error('Ошибка выхода из системы:', error);
        res.clearCookie('token');
        res.json({success: true, message: 'Успешный выход из системы'});
    }
});

// Текущий пользователь по токену
router.get('/me', authGuard, async (req, res) => {
    try {

        const userId = (req as any).userId as string;
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь не найден'
            };
            return res.status(404).json(response);
        }
        const response: ApiResponse = {
            success: true,
            data: {
                user: {
                    id: (existingUser as any).id,
                    email: (existingUser as any).email,
                    userName: (existingUser as any).userName,
                    createdAt: new Date((existingUser as any).created_at || (existingUser as any).createdAt)
                }
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Ошибка получения текущего пользователя:', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка получения пользователя${devSuffix}`
        };
        res.status(500).json(response);
    }
});

export default router;
