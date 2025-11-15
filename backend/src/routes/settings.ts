import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {UserModel} from "../models/User";
import {ApiResponse} from "../types";
import {ChangeEmailFrontendStructure, ChangePasswordFrontendStructure} from "../types/settingsBackendStructure";

const router = Router();

router.post('/settings/change-email', authGuard, async (req, res) => {
    const {currentEmail, newEmail, currentPassword}: ChangeEmailFrontendStructure = req.body;


});

router.post('/settings/change-password', authGuard, async (req, res) => {
    const {currentPassword, newPassword}: ChangePasswordFrontendStructure = req.body;



});

router.get('/settings/my-profile-data', authGuard, async (req, res) => {



});

router.delete('/settings/delete-my-account', authGuard, async (req, res) => {



});

export default router;
