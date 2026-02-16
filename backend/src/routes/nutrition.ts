import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddNewDayFrontendStructure, DayUpdateFrontendStructure} from "../types/nutrition";
import {validateNutritionDayData} from "../lib/backendValidators/nutrition";
import {NutritionDayModel} from "../models/NutritionDay";
import {showBackendError} from "../lib";

const router = Router();

router.post('/day', authGuard, async (req, res) => {
    try {
        const requestData: AddNewDayFrontendStructure = req.body;
        const userId:number = (req as any).userId;

        const validateResult = validateNutritionDayData(requestData);

        if (!validateResult) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления нового дня, пожалуйста проверьте введенные вами данные'
            };
            return res.status(400).json(response);
        }

        await NutritionDayModel.create(userId, requestData);

        const response: ApiResponse = {success: true};

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при добавлении нового дня');

        res.status(500).json(response);
    }
});

router.get('/days', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
        const days = await NutritionDayModel.getList(userId);

        const response: ApiResponse = {
            success: true,
            data: { days }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при показе списка дней');

        res.status(500).json(response);
    }
});

router.delete('/day', authGuard, async (req, res) => {
    try {
        const { dayId } = req.body;
        const userId:number = (req as any).userId;

        const dayPublicId = String(dayId || '').trim();

        if (!dayPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор дня',
            };
            return res.status(400).json(response);
        }

        const isDeleted = await NutritionDayModel.delete(userId, dayPublicId);

        if (!isDeleted) {
            const response: ApiResponse = {
                success: false,
                error: 'День не найден или у вас нет доступа для его удаления',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {success: true};

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при удалении дня');

        res.status(500).json(response);
    }
});

router.get('/about-my-day', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
        const dayPublicId = String(req.query.dayId || '').trim();

        if (!dayPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор дня',
            };
            return res.status(400).json(response);
        }

        const day = await NutritionDayModel.information(userId, dayPublicId);

        if (!day) {
            const response: ApiResponse = {
                success: false,
                error: 'День не найден или у вас нет к нему доступа',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            data: { day }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при получении информации о дне');

        res.status(500).json(response);
    }
});

router.put('/day', authGuard, async (req, res) => {
    try {
        const requestData: DayUpdateFrontendStructure = req.body;
        const userId:number = (req as any).userId;

        const validateResult = validateNutritionDayData(requestData);

        if (!validateResult) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения дня, пожалуйста проверьте введенные вами данные'
            };
            return res.status(400).json(response);
        }

        await NutritionDayModel.update(userId, requestData);

        const response: ApiResponse = {success: true};

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при изменении дня');

        res.status(500).json(response);
    }
});

export default router;
