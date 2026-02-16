import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';
import { config } from '../config';
import { authGuard } from '../middleware/authMiddleware';
import {
    ChangeEmailFrontendStructure,
    ChangePasswordFrontendStructure,
    LoginRequest,
    RegisterRequest
} from "../types/user";
import {showBackendError} from "../lib";
import {
    validateConfirmPassword, validateTwoPassword,
    validateUserEmail,
    validateUserName,
    validateUserPassword
} from "../lib/backendValidators/user";
import {UserModel} from "../models/User";

const router = Router();

router.post('/registration', async (req, res) => {
    try {
        const { email, password, userName }: RegisterRequest = req.body;

        const nameValidation = validateUserName(userName);
        const emailValidation = validateUserEmail(email)
        const passwordValidation = validateUserPassword(password);

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

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при регистрации пользователя');

        res.status(500).json(response);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { userName, password, rememberMe }: LoginRequest = req.body;

        const userNameValidation = validateUserName(userName)
        const passwordValidation = validateUserPassword(password);

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
        const userId:number = (req as any).userId;

        await UserModel.logout(userId);

        res.clearCookie('token');

        const response: ApiResponse = { success: true };

        res.json(response);
    } catch (error) {
        console.error('Ошибка корректного выхода из системы:', error);
        res.clearCookie('token');

        const response: ApiResponse = { success: true };

        res.json(response);
    }
});

// Текущий пользователь по токену
router.get('/me', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
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

router.post('/change-email', authGuard, async (req, res) => {
    try {
        const requestData: ChangeEmailFrontendStructure = req.body;
        const userId:number = (req as any).userId;

        const newEmailError:boolean = validateUserEmail(requestData.newEmail);
        const currentPasswordError:boolean = validateUserPassword(requestData.currentPassword);

        if (!newEmailError || !currentPasswordError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка смены почты, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await UserModel.changeEmail(userId, requestData);

        const response: ApiResponse = {success: true};

        res.status(200).json(response);
    } catch (error){
        const err: any = error;

        if (err?.code === 'INVALID_CURRENT_PASSWORD') {
            const response: ApiResponse = {
                success: false,
                error: 'Текущий пароль указан неверно.'
            };
            return res.status(400).json(response);
        }

        if (err?.code === 'USER_NOT_FOUND') {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь не найден.'
            };
            return res.status(404).json(response);
        }

        if (err?.code === 'EMAIL_ALREADY_IN_USE') {
            const response: ApiResponse = {
                success: false,
                error: 'Указанная почта уже используется другим аккаунтом.'
            };
            return res.status(400).json(response);
        }

        if (err?.code === 'EMAIL_SAME_AS_CURRENT') {
            const response: ApiResponse = {
                success: false,
                error: 'Новый email совпадает с текущим.'
            };
            return res.status(400).json(response);
        }

        const response = showBackendError(error, 'Ошибка при смене почты');

        res.status(500).json(response);
    }
});

router.post('/change-password', authGuard, async (req, res) => {
    try {
        const requestData: ChangePasswordFrontendStructure = req.body;
        const userId:number = (req as any).userId;

        const currentPasswordError:boolean = validateUserPassword(requestData.currentPassword);
        const newPasswordError:boolean = validateUserPassword(requestData.newPassword);
        const confirmPasswordError:boolean = validateConfirmPassword(requestData.newPassword, requestData.confirmPassword);
        const twoPasswordError:boolean = validateTwoPassword(requestData.currentPassword, requestData.newPassword);

        if (!currentPasswordError || !newPasswordError || !confirmPasswordError || !twoPasswordError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка смены пароля, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await UserModel.changePassword(userId, requestData);

        const response: ApiResponse = {success: true};

        res.status(200).json(response);
    } catch (error){
        const err: any = error;

        if (err?.code === 'INVALID_CURRENT_PASSWORD') {
            const response: ApiResponse = {
                success: false,
                error: 'Текущий пароль указан неверно.'
            };
            return res.status(400).json(response);
        }

        if (err?.code === 'USER_NOT_FOUND') {
            const response: ApiResponse = {
                success: false,
                error: 'Пользователь не найден.'
            };
            return res.status(404).json(response);
        }

        const response = showBackendError(error, 'Ошибка при смене пароля');

        res.status(500).json(response);
    }
});

export default router;
