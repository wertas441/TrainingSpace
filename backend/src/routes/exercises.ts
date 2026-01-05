import {Router} from 'express';
import {authGuard} from "../middleware/authMiddleware";
import {ApiResponse} from "../types";
import {ExerciseModel} from "../models/Exercise";
import {showBackendError} from "../lib/indexUtils";

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
        const response = showBackendError(error, 'Ошибка при показе списка упражнений');

        res.status(500).json(response);
    }
});

export default router;
