import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';
import { userEmailValidator, userNameValidator, userPasswordValidator } from '../lib/backendValidators/index'
import { UserModel } from '../models/User';
import { config } from '../config';
import { authGuard } from '../middleware/authMiddleware';
import {LoginRequest, RegisterRequest} from "../types/user";
import {showBackendError} from "../lib/indexUtils";

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

        const existingByEmail = await UserModel.findByEmail(email);
        if (existingByEmail) {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь с таким email уже существует.'
            };
            return res.status(409).json(response);
        }

        const existingByUserName = await UserModel.findByUserName(userName);
        if (existingByUserName) {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь с таким именем уже существует.'
            };
            return res.status(409).json(response);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({ email, userName, password: hashedPassword });

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при регистрации пользователя');

        res.status(500).json(response);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { userName, password, rememberMe }: LoginRequest = req.body;

        const userNameValidation = userNameValidator(userName)
        const passwordValidation = userPasswordValidator(password);

        if (!userNameValidation || !passwordValidation) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка авторизации пользователя, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        // Проверка пользователя в базе данных
        const existingUser = await UserModel.findByUserName(userName);
        if (!existingUser) {
            const response: ApiResponse = {
                success: false,
                error: 'Неверное имя пользователя или пароль.'
            };
            return res.status(401).json(response);
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, (existingUser as any).password);
        if (!isPasswordValid) {
            const response: ApiResponse = {
                success: false,
                error: 'Неверное имя пользователя или пароль.'
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
            data: { token }
        };

        res.json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при входе в систему');

        res.status(500).json(response);
    }
});

router.post('/logout', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        await UserModel.logout(userId);

        res.clearCookie('token');

        const response: ApiResponse = { success: true };

        res.json(response);
    } catch (error) {
        console.error('Ошибка корректного выхода из системы:', error);
        res.clearCookie('token');

        const response: ApiResponse = {
            success: true,
        };

        res.json(response);
    }
});

// Текущий пользователь по токену
router.get('/me', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const userData = await UserModel.findById(userId);

        if (!userData) {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь не найден'
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            data: { userData }
        };

        res.json(response);
    } catch (error) {
        const response = showBackendError(error, `Ошибка получения информации о текущем пользователе`);

        res.status(500).json(response);
    }
});

export default router;
