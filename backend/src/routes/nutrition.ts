import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {UserModel} from "../models/User";
import {ApiResponse} from "../types";
import {AddNewDayFrontendStructure} from "../types/nutritionBackendTypes";
import {
    validateCalories, validateCarb,
    validateDayDescription,
    validateDayName,
    validateFat, validateNutritionDay,
    validateProtein
} from "../lib/validators";

const router = Router();

router.post('/nutrition/add-new-day', authGuard, async (req, res) => {
    try {
        const {dayName, dayDescription, calories, protein, fat, carb, dayDate}: AddNewDayFrontendStructure = req.body;

        const dayNameError:boolean = validateDayName(dayName);
        const dayDescriptionError:boolean = validateDayDescription(dayDescription);
        const caloriesError:boolean = validateCalories(calories);
        const proteinError:boolean = validateProtein(protein);
        const fatError:boolean = validateFat(fat);
        const carbError:boolean = validateCarb(carb);
        const dayDateError:boolean = validateNutritionDay(dayDate);

        if (!dayNameError || !dayDescriptionError || !caloriesError || !proteinError || !fatError || !carbError || !dayDateError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления нового дня, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }



    } catch (error){

    }
});

router.get('/nutrition/my-day-list', authGuard, async (req, res) => {

});

router.delete('/nutrition/delete-my-day', authGuard, async (req, res) => {

});

router.get('/nutrition/my-day-about', authGuard, async (req, res) => {

});

router.put('/nutrition/change-my-day', authGuard, async (req, res) => {

});


export default router;
