import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {UserModel} from "../models/User";
import {ApiResponse} from "../types";

const router = Router();

router.post('/nutrition/add-new-day', authGuard, async (req, res) => {

});

router.get('/nutrition/my-day-list', authGuard, async (req, res) => {

});

router.delete('/nutrition/delete-my-day', authGuard, async (req, res) => {

});

router.put('/nutrition/change-my-day', authGuard, async (req, res) => {

});


export default router;
