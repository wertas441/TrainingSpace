import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import { ApiResponse } from "../types";
import {
    AddNewGoalFrontendStructure,
    GoalUpdateFrontendResponse,
    GoalUpdateFrontendStructure
} from "../types/goalBackendTypes";
import { validateGoalDescription, validateGoalName, validateGoalPriority } from "../lib/backendValidators/goalValidators";
import { GoalModel } from "../models/Goal";
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

        res.status(200).json(response);
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
    try {

        const userId = (req as any).userId as number;

        const goals = await GoalModel.getList(userId);
        
        const response: ApiResponse = {
            success: true,
            message: 'success of getting list of goals',
            data: { goals }
        };

        res.status(200).json(response);
    } catch (error){

        console.error('Ошибка показа списка целей', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе списка целей ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/my-shorty-list', authGuard, async (req, res) => {
    try {

        const userId = (req as any).userId as number;
        const goals = await GoalModel.getShortyList(userId);

        const response: ApiResponse = {
            success: true,
            message: 'success of getting shorty list of goals',
            data: { goals }
        };

        res.status(200).json(response);
    } catch (error){

        console.error('Ошибка показа короткого списка целей', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе короткого списка целей ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.delete('/delete-my-goal', authGuard, async (req, res) => {
    try {
        const { goalId: goalPublicIdRaw } = req.body;
        const userId = (req as any).userId as number;

        const goalPublicId = String(goalPublicIdRaw || '').trim();

        if (!goalPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        const isDeleted = await GoalModel.delete(userId, goalPublicId);

        if (!isDeleted) {
            const response: ApiResponse = {
                success: false,
                error: 'Цель не найдена или у вас нет доступа для ее удаления.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'goal delete successfully',
        };

        res.status(200).json(response);
    } catch (error){
        console.error('Ошибка удаления цели', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при удалении цели ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/about-my-goal', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        const goalPublicIdRaw = req.query.goalId;
        const goalPublicId = String(goalPublicIdRaw || '').trim();

        if (!goalPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        const goalInfo = await GoalModel.information(userId, goalPublicId);

        if (!goalInfo) {
            const response: ApiResponse = {
                success: false,
                error: 'Цель не найдена или у вас нет к ней доступа.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            message: 'success of getting goal information',
            data: { goal: goalInfo }
        };

        res.status(200).json(response);
    } catch (error){

        console.error('Ошибка получения информации о цели', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при получении информации о цели ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.put('/update-my-goal', authGuard, async (req, res) => {
    try {
        const { goalId, name, description, priority }: GoalUpdateFrontendStructure = req.body;
        const userId = (req as any).userId as number;


        const goalPublicId = String(goalId || '').trim();

        if (!goalPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        const goalNameValid = validateGoalName(name);
        const goalDescriptionValid = validateGoalDescription(description);
        const goalPriorityValid = validateGoalPriority(priority);

        if (!goalNameValid || !goalDescriptionValid || !goalPriorityValid) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения цели, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await GoalModel.update({name, description, priority, goalId: goalPublicId, userId} as GoalUpdateFrontendResponse);

        const response: ApiResponse = {
            success: true,
            message: 'goal updated successfully',
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Ошибка изменения цели', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при изменении цели ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.put('/complete-my-goal', authGuard, async (req, res) => {
    try {
        const { goalId: goalPublicIdRaw } = req.body;
        const goalPublicId = String(goalPublicIdRaw || '').trim();
        const userId = (req as any).userId as number;


        if (!goalPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        await GoalModel.complete(userId, goalPublicId);

        const response: ApiResponse = {
            success: true,
            message: 'goal complete successfully',
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Ошибка выполнения цели', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при выполннеии цели ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

router.get('/my-complete-list', authGuard, async (req, res) => {
    try {

        const userId = (req as any).userId as number;

        const goals = await GoalModel.getCompleteList(userId);

        const response: ApiResponse = {
            success: true,
            message: 'success of getting complete list of goals',
            data: { goals }
        };

        res.status(200).json(response);
    } catch (error){

        console.error('Ошибка показа списка завершенных целей', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе списка завершенных целей ${devSuffix}`
        };

        res.status(500).json(response);
    }
});

export default router;
