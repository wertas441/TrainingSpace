import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {UserModel} from "../models/User";
import {ApiResponse} from "../types";

const router = Router();

router.post('/settings/change-email', authGuard, async (req, res) => {

});

router.post('/settings/change-password', authGuard, async (req, res) => {

});

router.get('/settings/my-profile-data', authGuard, async (req, res) => {

});

router.delete('/settings/delete-my-account', authGuard, async (req, res) => {

});

export default router;
