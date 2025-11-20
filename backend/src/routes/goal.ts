import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddNewGoalFrontendStructure} from "../types/goalBackendTypes";
import {validateGoalDescription, validateGoalName, validateGoalPriority} from "../lib/backendValidators/goalValidators";
import {GoalModel} from "../models/Goal";
import { config } from '../config';

const router = Router();

router.post('/add-new-goal', authGuard, async (req, res) => {
    try {
        const {name, description, priority}: AddNewGoalFrontendStructure = req.body;

        const goalNameError:boolean = validateGoalName(name);
        const goalDescriptionError:boolean = validateGoalDescription(description);
        const goalPriorityError:boolean = validateGoalPriority(priority);

        const userId = (req as any).userId as number;

        if (!goalNameError || !goalDescriptionError || !goalPriorityError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления новой цели, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await GoalModel.create({user_id: userId, name, description, priority });

        const response: ApiResponse = {
            success: true,
            message: 'goal created successfully',
        };

        res.status(201).json(response);
    } catch (error){

        console.error('Ошибка добавления цели', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при добавлении новой цели ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/my-goals-list', authGuard, async (req, res) => {

});

router.delete('/delete-my-goal', authGuard, async (req, res) => {

});

router.get('/my-goal-about', authGuard, async (req, res) => {

});

router.put('/change-my-goal', authGuard, async (req, res) => {

});


export default router;
