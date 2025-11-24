import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {ChangeEmailFrontendStructure, ChangePasswordFrontendStructure} from "../types/settingsBackendTypes";
import { config } from '../config';
import {
    validateConfirmPassword,
    validateTwoPassword,
    validateUserPassword
} from "../lib/backendValidators/settingsValidators";
import {SettingModel} from "../models/Setting";

const router = Router();

router.post('/change-email', authGuard, async (req, res) => {
    const {currentEmail, newEmail, currentPassword}: ChangeEmailFrontendStructure = req.body;


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

        // Специальная обработка ошибок смены пароля
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

        console.error('Ошибка смены пароля', error);

        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при смене пароля ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/my-profile-data', authGuard, async (req, res) => {

});

router.delete('/delete-my-account', authGuard, async (req, res) => {

});

export default router;
