import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddNewDayFrontendStructure, DayListFrontendStructure} from "../types/nutritionBackendTypes";
import {
    validateCalories, validateCarb,
    validateDayDescription,
    validateDayName,
    validateFat, validateNutritionDayDate,
    validateProtein
} from "../lib/backendValidators/nutrationValidators";

const router = Router();

router.post('/nutrition/add-new-day', authGuard, async (req, res) => {
    try {
        const {name, description, calories, protein, fat, carb, date}: AddNewDayFrontendStructure = req.body;

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
                error: 'Ошибка добавления нового дня, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }



    } catch (error){

    }
});

router.get('/nutrition/my-day-list', authGuard, async (req, res) => {
    const {id, name, description, calories, protein, fat, carb, date}: DayListFrontendStructure = req.body;


});

router.delete('/nutrition/delete-my-day', authGuard, async (req, res) => {

});

router.get('/nutrition/my-day-about', authGuard, async (req, res) => {

});

router.put('/nutrition/change-my-day', authGuard, async (req, res) => {

});


export default router;
