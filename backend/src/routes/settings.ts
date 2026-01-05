import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {ChangeEmailFrontendStructure, ChangePasswordFrontendStructure} from "../types/settingsBackendTypes";
import { config } from '../config';
import {
    validateConfirmPassword,
    validateTwoPassword, validateUserEmail,
    validateUserPassword
} from "../lib/backendValidators/settingsValidators";
import {SettingModel} from "../models/Setting";
import {showBackendError} from "../lib/indexUtils";

const router = Router();

router.post('/change-email', authGuard, async (req, res) => {
    try {
        const {newEmail, currentPassword}: ChangeEmailFrontendStructure = req.body;
        const userId = (req as any).userId as number;

        const newEmailError:boolean = validateUserEmail(newEmail);
        const currentPasswordError:boolean = validateUserPassword(currentPassword);

        if (!newEmailError || !currentPasswordError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка смены почты, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await SettingModel.changeEmail({userId, newEmail, currentPassword});

        const response: ApiResponse = {
            success: true,
            message: 'email was changed successfully',
        };

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
        const {currentPassword, newPassword, confirmPassword}: ChangePasswordFrontendStructure = req.body;

        const currentPasswordError:boolean = validateUserPassword(currentPassword);
        const newPasswordError:boolean = validateUserPassword(newPassword);
        const confirmPasswordError:boolean = validateConfirmPassword(newPassword, confirmPassword);
        const twoPasswordError:boolean = validateTwoPassword(currentPassword, newPassword);

        const userId = (req as any).userId as number;

        if (!currentPasswordError || !newPasswordError || !confirmPasswordError || !twoPasswordError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка смены пароля, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await SettingModel.changePassword({userId, currentPassword, newPassword, confirmPassword});

        const response: ApiResponse = {
            success: true,
            message: 'password was changed successfully',
        };

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

router.delete('/delete-my-account', authGuard, async (req, res) => {

});

export default router;
