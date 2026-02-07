import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {
    validateActivityDescription,
    validateActivityDifficult,
    validateActivityExercisesCreate,
    validateActivityExercisesUpdate,
    validateActivityName,
    validateActivityPerformedAt,
    validateActivityTrainingId,
    validateActivityType
} from "../lib/backendValidators/activity";
import {ActivityListFrontendStructure, AddActivityFrontendRequest} from "../types/activity";
import {ActivityModel} from "../models/Activity";
import {showBackendError} from "../lib/indexUtils";

const router = Router();

router.post('/activity', authGuard, async (req, res) => {
    try {
        const { requestData }: {requestData: AddActivityFrontendRequest} = req.body;

        const activityNameError:boolean = validateActivityName(requestData.activityName);
        const activityDescriptionError:boolean = validateActivityDescription(requestData.description);
        const activityTypeError:boolean = validateActivityType(requestData.activityType);
        const activityDifficultError:boolean = validateActivityDifficult(requestData.activityDifficult);
        const activityTrainingIdError:boolean = validateActivityTrainingId(requestData.trainingId);
        const activityPerformedError:boolean = validateActivityPerformedAt(requestData.performedAt);
        const activityExercisesError:boolean = validateActivityExercisesCreate(requestData.exercises);

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

        await ActivityModel.create(userId, requestData);

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при добавлении активности');

        res.status(500).json(response);
    }
});

router.get('/activities', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const activity = await ActivityModel.getList(userId);

        const response: ApiResponse = {
            success: true,
            data: { activity }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при показе списка активностей');

        res.status(500).json(response);
    }
});

router.get('/about-my-activity', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const activityPublicId = String(req.query.activityId || '').trim();

        if (!activityPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности.',
            };
            return res.status(400).json(response);
        }

        const activity = await ActivityModel.information(userId, activityPublicId);

        if (!activity) {
            const response: ApiResponse = {
                success: false,
                error: 'Активность не найдена или у вас нет к ней доступа.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'success of getting activity information',
            data: { activity }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при получении информации об активности');

        res.status(500).json(response);
    }
});


router.delete('/activity', authGuard, async (req, res) => {
    try {
        const { activityId } = req.body;
        const userId = (req as any).userId as number;

        if (!activityId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности.',
            };
            return res.status(400).json(response);
        }

        const isDeleted = await ActivityModel.delete(userId, activityId);

        if (!isDeleted) {
            const response: ApiResponse = {
                success: false,
                error: 'Активность не найдена или у вас нет доступа для ее удаления.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при удалении активности');

        res.status(500).json(response);
    }
});

router.put('/activity', authGuard, async (req, res) => {
    try {
        const { requestData }: {requestData: ActivityListFrontendStructure} = req.body;

        const activityNameError:boolean = validateActivityName(requestData.name);
        const activityDescriptionError:boolean = validateActivityDescription(requestData.description);
        const activityTypeError:boolean = validateActivityType(requestData.type);
        const activityDifficultError:boolean = validateActivityDifficult(requestData.difficulty);
        const activityTrainingIdError:boolean = validateActivityTrainingId(requestData.trainingId);
        const activityPerformedError:boolean = validateActivityPerformedAt(requestData.activityDate);
        const activityExercisesError:boolean = validateActivityExercisesUpdate(requestData.exercises);

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
                error: 'Ошибка изменения активности, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await ActivityModel.update(userId, requestData);

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при изменении активности');

        res.status(500).json(response);
    }
});


export default router;
