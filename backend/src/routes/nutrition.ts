import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddNewDayFrontendStructure, DayUpdateFrontendStructure} from "../types/nutritionBackendTypes";
import {
    validateCalories,
    validateCarb,
    validateDayDescription,
    validateDayName,
    validateFat,
    validateNutritionDayDate,
    validateProtein
} from "../lib/backendValidators/nutrationValidators";
import {NutritionModel} from "../models/Nutrition";
import {showBackendError} from "../lib/indexUtils";

const router = Router();

router.post('/add-new-day', authGuard, async (req, res) => {
    try {
        const { requestData }: {requestData: AddNewDayFrontendStructure } = req.body;

        const dayNameError:boolean = validateDayName(requestData.name);
        const dayDescriptionError:boolean = validateDayDescription(requestData.description);
        const caloriesError:boolean = validateCalories(requestData.calories);
        const proteinError:boolean = validateProtein(requestData.protein);
        const fatError:boolean = validateFat(requestData.fat);
        const carbError:boolean = validateCarb(requestData.carb);
        const dayDateError:boolean = validateNutritionDayDate(requestData.date);

        const userId = (req as any).userId as number;

        if (!dayNameError || !dayDescriptionError || !caloriesError || !proteinError || !fatError || !carbError || !dayDateError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления нового дня, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await NutritionModel.create(userId, requestData);

        const response: ApiResponse = {
            success: true,
            message: 'day created successfully',
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при добавлении нового дня');

        res.status(500).json(response);
    }
});

router.get('/my-day-list', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const days = await NutritionModel.getList(userId);

        const response: ApiResponse = {
            success: true,
            message: 'success of getting list of days',
            data: { days }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при показе списка дней');

        res.status(500).json(response);
    }
});

router.delete('/delete-my-day', authGuard, async (req, res) => {
    try {
        const { dayId } = req.body;
        const userId = (req as any).userId as number;

        const dayPublicId = String(dayId || '').trim();

        if (!dayPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор дня.',
            };
            return res.status(400).json(response);
        }

        const isDeleted = await NutritionModel.delete(userId, dayPublicId);

        if (!isDeleted) {
            const response: ApiResponse = {
                success: false,
                error: 'День не найден или у вас нет доступа для его удаления.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'day delete successfully',
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при удалении дня');

        res.status(500).json(response);
    }
});

router.get('/about-my-day', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const dayPublicId = String(req.query.dayId || '').trim();

        if (!dayPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор дня.',
            };
            return res.status(400).json(response);
        }

        const dayInfo = await NutritionModel.information(userId, dayPublicId);

        if (!dayInfo) {
            const response: ApiResponse = {
                success: false,
                error: 'День не найден или у вас нет к нему доступа.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'success of getting day information',
            data: { day: dayInfo }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при получении информации о дне');

        res.status(500).json(response);
    }
});

router.put('/update-my-day', authGuard, async (req, res) => {
    try {
        const { requestData }: {requestData: DayUpdateFrontendStructure} = req.body;
        const userId = (req as any).userId as number;

        const dayNameError:boolean = validateDayName(requestData.name);
        const dayDescriptionError:boolean = validateDayDescription(requestData.description);
        const caloriesError:boolean = validateCalories(requestData.calories);
        const proteinError:boolean = validateProtein(requestData.protein);
        const fatError:boolean = validateFat(requestData.fat);
        const carbError:boolean = validateCarb(requestData.carb);
        const dayDateError:boolean = validateNutritionDayDate(requestData.date);

        if (!dayNameError || !dayDescriptionError || !caloriesError || !proteinError || !fatError || !carbError || !dayDateError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения дня, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await NutritionModel.update(userId, requestData);

        const response: ApiResponse = {
            success: true,
            message: 'day changed successfully',
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при изменении дня');

        res.status(500).json(response);
    }
});

export default router;
