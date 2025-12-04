import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import { config } from '../config';
import {
    validateActivityDescription,
    validateActivityDifficult,
    validateActivityExercisesCreate,
    validateActivityExercisesUpdate,
    validateActivityName,
    validateActivityPerformedAt,
    validateActivityTrainingId,
    validateActivityType
} from "../lib/backendValidators/activityValidators";
import {ActivityUpdateFrontendStructure, AddActivityFrontendRequest} from "../types/activityBackendTypes";
import {ActivityModel} from "../models/Activity";
import {GoalModel} from "../models/Goal";

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
        const activityExercisesError:boolean = validateActivityExercisesCreate(exercises);

        const userId = (req as any).userId as number;

        if (!activityNameError
            || !activityDescriptionError
            || !activityTypeError
            || !activityDifficultError
            || !activityTrainingIdError
            || !activityPerformedError
            || !activityExercisesError
        ) {
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

router.get('/about-my-activity', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        const activityPublicIdRaw = req.query.activityId;
        const activityPublicId = String(activityPublicIdRaw || '').trim();

        if (!activityPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности.',
            };
            return res.status(400).json(response);
        }

        const activityInfo = await ActivityModel.information(userId, activityPublicId);

        if (!activityInfo) {
            const response: ApiResponse = {
                success: false,
                error: 'Активность не найдена или у вас нет к ней доступа.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'success of getting activity information',
            data: { activity: activityInfo }
        };

        res.status(200).json(response);
    } catch (error){

        console.error('Ошибка получения информации об активности', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при получении информации об активности ${devSuffix}`
        };

        res.status(500).json(response);
    }
});


router.delete('/delete-my-activity', authGuard, async (req, res) => {
    try {
        const { activityId: activityPublicIdRaw } = req.body as { activityId?: string };
        const userId = (req as any).userId as number;

        const activityPublicId = String(activityPublicIdRaw || '').trim();

        if (!activityPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности.',
            };
            return res.status(400).json(response);
        }

        const isDeleted = await ActivityModel.delete(userId, activityPublicId);

        if (!isDeleted) {
            const response: ApiResponse = {
                success: false,
                error: 'Активность не найдена или у вас нет доступа для ее удаления.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'activity delete successfully',
        };

        res.status(200).json(response);
    } catch (error){
        console.error('Ошибка удаления активности', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при удалении активности ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.put('/update-my-activity', authGuard, async (req, res) => {
    try {
        const {
            activityId,
            name,
            description,
            type,
            difficulty,
            trainingId,
            activityDate,
            exercises,
        }: ActivityUpdateFrontendStructure = req.body;

        const activityNameError:boolean = validateActivityName(name);
        const activityDescriptionError:boolean = validateActivityDescription(description);
        const activityTypeError:boolean = validateActivityType(type);
        const activityDifficultError:boolean = validateActivityDifficult(difficulty);
        const activityTrainingIdError:boolean = validateActivityTrainingId(trainingId);
        const activityPerformedError:boolean = validateActivityPerformedAt(activityDate);
        const activityExercisesError:boolean = validateActivityExercisesUpdate(exercises);

        const userId = (req as any).userId as number;

        const activityPublicId = String(activityId || '').trim();

        if (!activityPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности.',
            };
            return res.status(400).json(response);
        }

        if (!activityNameError
            || !activityDescriptionError
            || !activityTypeError
            || !activityDifficultError
            || !activityTrainingIdError
            || !activityPerformedError
            || !activityExercisesError
        ) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения активности, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await ActivityModel.update({
            id: 0, // фактический id будет получен по publicId внутри модели
            publicId: activityPublicId,
            userId,
            name,
            description,
            type,
            difficulty,
            trainingId,
            activityDate,
            exercises,
        } as any);

        const response: ApiResponse = {
            success: true,
            message: 'activity changed successfully',
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Ошибка изменения активности ', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при изменении активности ${devSuffix}`
        };

        res.status(500).json(response);
    }
});


export default router;
