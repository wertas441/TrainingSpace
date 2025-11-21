import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddNewDayFrontendStructure} from "../types/nutritionBackendTypes";
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

        await NutritionModel.create({user_id: userId, name, description, calories, protein, fat, carb, day_date: date});

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

});

router.get('/my-day-about', authGuard, async (req, res) => {

});

router.put('/change-my-day', authGuard, async (req, res) => {

});


export default router;
