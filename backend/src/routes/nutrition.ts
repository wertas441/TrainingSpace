import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddNewDayFrontendStructure, DayListFrontendStructure, DayUpdateFrontendStructure} from "../types/nutritionBackendTypes";
import {
    validateCalories, validateCarb,
    validateDayDescription,
    validateDayName,
    validateFat, validateNutritionDayDate,
    validateProtein
} from "../lib/backendValidators/nutrationValidators";
import {NutritionModel} from "../models/Nutrition";
import { config } from '../config';

const router = Router();

router.post('/add-new-day', authGuard, async (req, res) => {
    try {
        const {name, description, calories, protein, fat, carb, date}: AddNewDayFrontendStructure = req.body;

        const dayNameError:boolean = validateDayName(name);
        const dayDescriptionError:boolean = validateDayDescription(description);
        const caloriesError:boolean = validateCalories(calories);
        const proteinError:boolean = validateProtein(protein);
        const fatError:boolean = validateFat(fat);
        const carbError:boolean = validateCarb(carb);
        const dayDateError:boolean = validateNutritionDayDate(date);

        const userId = (req as any).userId as number;

        if (!dayNameError || !dayDescriptionError || !caloriesError || !proteinError || !fatError || !carbError || !dayDateError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления нового дня, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await NutritionModel.create({user_id: userId, name, description, calories, protein, fat, carb, date});

        const response: ApiResponse = {
            success: true,
            message: 'day created successfully',
        };

        res.status(200).json(response);
    } catch (error){
        console.error('Ошибка добавления дня', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при добавлении нового дня ${devSuffix}`
        };

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

        console.error('Ошибка показа списка дней', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе списка дней ${devSuffix}`
        };

        res.status(500).json(response);
    }

});

router.delete('/delete-my-day', authGuard, async (req, res) => {
    try {
        const { dayId: dayPublicIdRaw } = req.body;
        const userId = (req as any).userId as number;

        const dayPublicId = String(dayPublicIdRaw || '').trim();

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
        console.error('Ошибка удаления дня', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при удалении дня ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/about-my-day', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        const dayPublicIdRaw = req.query.dayId;
        const dayPublicId = String(dayPublicIdRaw || '').trim();

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

        console.error('Ошибка получения информации о дне', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при получении информации о дне ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.put('/update-my-day', authGuard, async (req, res) => {
    try {
        const {dayId, name, description, calories, protein, fat, carb, date}: DayUpdateFrontendStructure = req.body;
        const userId = (req as any).userId as number;

        const dayPublicId = String(dayId || '').trim();

        if (!dayPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор дня.',
            };
            return res.status(400).json(response);
        }

        const dayNameError:boolean = validateDayName(name);
        const dayDescriptionError:boolean = validateDayDescription(description);
        const caloriesError:boolean = validateCalories(calories);
        const proteinError:boolean = validateProtein(protein);
        const fatError:boolean = validateFat(fat);
        const carbError:boolean = validateCarb(carb);
        const dayDateError:boolean = validateNutritionDayDate(date);


        if (!dayNameError || !dayDescriptionError || !caloriesError || !proteinError || !fatError || !carbError || !dayDateError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения дня, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await NutritionModel.update({
            name,
            description,
            calories,
            protein,
            fat,
            carb,
            date,
            publicId: dayPublicId,
            user_id: userId,
        });

        const response: ApiResponse = {
            success: true,
            message: 'day changed successfully',
        };

        res.status(200).json(response);
    } catch (error){
        console.error('Ошибка изменения дня', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при изменении дня ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

export default router;
