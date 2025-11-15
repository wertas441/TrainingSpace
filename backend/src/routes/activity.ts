import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {UserModel} from "../models/User";
import {ApiResponse} from "../types";

const router = Router();

router.post('/activity/add-new-activity', authGuard, async (req, res) => {

});

router.get('/activity/my-activity-list', authGuard, async (req, res) => {

});


router.delete('/activity/delete-my-activity', authGuard, async (req, res) => {

});

router.put('/activity/change-my-activity', authGuard, async (req, res) => {

});


export default router;
