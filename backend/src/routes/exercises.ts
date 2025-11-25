import {Router} from 'express';
import {authGuard} from "../middleware/authMiddleware";
import {ApiResponse} from "../types";
import { config } from '../config';
import {ExerciseModel} from "../models/Exercise";

const router = Router();

router.get('/exercises-list', authGuard, async (req, res) => {
    try {
        const exercises = await ExerciseModel.getList();

        const response: ApiResponse = {
            success: true,
            message: 'success of getting list of exercises',
            data: { exercises }
        };

        res.status(200).json(response);
    } catch (error){

        console.error('Ошибка показа списка упражнений', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе списка упражнений ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

export default router;
