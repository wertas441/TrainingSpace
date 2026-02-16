import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {
    validateActivityData,
    validateUpdateActivityData,
} from "../lib/backendValidators/activity";
import {AddActivityFrontendRequest} from "../types/activity";
import {ActivityModel} from "../models/Activity";
import {showBackendError} from "../lib";

const router = Router();

router.post('/activity', authGuard, async (req, res) => {
    try {
        const requestData: AddActivityFrontendRequest = req.body;
        const userId:number = (req as any).userId;

        const validationResult = validateActivityData(requestData);

        if (!validationResult) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления новой активности, пожалуйста проверьте введенные вами данные'
            };
            return res.status(400).json(response);
        }

        await ActivityModel.create(userId, requestData);

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при добавлении активности');

        res.status(500).json(response);
    }
});

router.get('/activities', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
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
        const userId:number = (req as any).userId;
        const activityPublicId = String(req.query.activityId || '').trim();

        if (!activityPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности',
            };
            return res.status(400).json(response);
        }

        const activity = await ActivityModel.information(userId, activityPublicId);

        if (!activity) {
            const response: ApiResponse = {
                success: false,
                error: 'Активность не найдена или у вас нет к ней доступа',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
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
        const userId:number = (req as any).userId;

        if (!activityId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор активности',
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

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при удалении активности');

        res.status(500).json(response);
    }
});

router.put('/activity', authGuard, async (req, res) => {
    try {
        const requestData = req.body;
        const userId:number = (req as any).userId;

        const validationResult = validateUpdateActivityData(requestData);

        if (!validationResult) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения активности, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await ActivityModel.update(userId, requestData);

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при изменении активности');

        res.status(500).json(response);
    }
});


export default router;
