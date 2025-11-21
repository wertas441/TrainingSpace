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
import {SettingMode} from "../models/Setting";

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

        await SettingMode.changePassword(
            {
                user_id: userId,
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

        const response: ApiResponse = {
            success: true,
            message: 'password was changed successfully',
        };

        res.status(200).json(response);
    } catch (error){
        console.error('Ошибка смены пароля', error);
        const err: any = error;
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
