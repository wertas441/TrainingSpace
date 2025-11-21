import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import { config } from '../config';
import {
    validateActivityDescription, validateActivityDifficult,
    validateActivityName, validateActivityPerformedAt, validateActivityTrainingId,
    validateActivityType
} from "../lib/backendValidators/activityValidators";
import {AddActivityFrontendRequest} from "../types/activityBackendTypes";
import {ActivityModel} from "../models/Activity";

const router = Router();

router.post('/add-new-activity', authGuard, async (req, res) => {
    try {
        const {
            activity_name,
            description,
            activity_type,
            activity_difficult,
            training_id,
            performed_at,
            exercises,
        }: AddActivityFrontendRequest = req.body;

        const activityNameError:boolean = validateActivityName(activity_name);
        const activityDescriptionError:boolean = validateActivityDescription(description);
        const activityTypeError:boolean = validateActivityType(activity_type);
        const activityDifficultError:boolean = validateActivityDifficult(activity_difficult);
        const activityTrainingIdError:boolean = validateActivityTrainingId(training_id);
        const activityPerformedError:boolean = validateActivityPerformedAt(performed_at);

        const userId = (req as any).userId as number;

        if (!activityNameError || !activityDescriptionError || !activityTypeError || !activityDifficultError || !activityTrainingIdError || !activityPerformedError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления новой активности, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await ActivityModel.create({
            user_id: userId,
            activity_name,
            description,
            activity_type,
            activity_difficult,
            training_id,
            performed_at,
            exercises,
        });

        const response: ApiResponse = {
            success: true,
            message: 'activity created successfully',
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Ошибка добавления активности ', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при добавлении активности ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/my-activity-list', authGuard, async (req, res) => {
    try {

        const userId = (req as any).userId as number;

        const activity = await ActivityModel.getList(userId);

        const response: ApiResponse = {
            success: true,
            message: 'success of getting list of activity',
            data: { activity }
        };

        res.status(200).json(response);
    } catch (error){
        console.error('Ошибка показа списка активностей', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе списка активностей ${devSuffix}`
        };

        res.status(500).json(response);
    }
});


router.delete('/delete-my-activity', authGuard, async (req, res) => {

});

router.put('/change-my-activity', authGuard, async (req, res) => {

});


export default router;
