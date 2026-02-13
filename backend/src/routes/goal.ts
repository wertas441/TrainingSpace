import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import { ApiResponse } from "../types";
import {
    AddNewGoalFrontendStructure,
    GoalUpdateFrontendStructure
} from "../types/goal";
import { validateGoalDescription, validateGoalName, validateGoalPriority } from "../lib/backendValidators/goal";
import { GoalModel } from "../models/Goal";
import {showBackendError} from "../lib";

const router = Router();

router.post('/goal', authGuard, async (req, res) => {
    try {
        const requestData: AddNewGoalFrontendStructure = req.body;
        const userId:number = (req as any).userId;

        const goalNameError:boolean = validateGoalName(requestData.name);
        const goalDescriptionError:boolean = validateGoalDescription(requestData.description);
        const goalPriorityError:boolean = validateGoalPriority(requestData.priority);

        if (!goalNameError || !goalDescriptionError || !goalPriorityError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления новой цели, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await GoalModel.create(userId, requestData);

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при добавлении новой цели');

        res.status(500).json(response);
    }
});

router.get('/goals', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
        const goals = await GoalModel.getList(userId);
        
        const response: ApiResponse = {
            success: true,
            data: { goals }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, `Ошибка при показе списка целей`);

        res.status(500).json(response);
    }
});

router.get('/short-goals', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
        const goals = await GoalModel.getShortyList(userId);

        const response: ApiResponse = {
            success: true,
            data: { goals }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, `Ошибка при показе короткого списка целей`);

        res.status(500).json(response);
    }
});

router.delete('/goal', authGuard, async (req, res) => {
    try {
        const { goalId } = req.body;
        const userId:number = (req as any).userId;

        const goalPublicId = String(goalId || '').trim();

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

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, `Ошибка при удалении цели`);

        res.status(500).json(response);
    }
});

router.get('/about-my-goal', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
        const goalPublicId = String(req.query.goalId || '').trim();

        if (!goalPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        const goal = await GoalModel.information(userId, goalPublicId);

        if (!goal) {
            const response: ApiResponse = {
                success: false,
                error: 'Цель не найдена или у вас нет к ней доступа.',
            };

            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            data: { goal }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, `Ошибка при получении информации о цели`);

        res.status(500).json(response);
    }
});

router.put('/goal', authGuard, async (req, res) => {
    try {
        const requestData: GoalUpdateFrontendStructure = req.body;
        const userId:number = (req as any).userId;

        const goalPublicId = String(requestData.goalId || '').trim();

        if (!goalPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        const goalNameValid = validateGoalName(requestData.name);
        const goalDescriptionValid = validateGoalDescription(requestData.description);
        const goalPriorityValid = validateGoalPriority(requestData.priority);

        if (!goalNameValid || !goalDescriptionValid || !goalPriorityValid) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения цели, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await GoalModel.update(userId, requestData);

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, `Ошибка при изменении цели`);

        res.status(500).json(response);
    }
});

router.put('/complete-goal', authGuard, async (req, res) => {
    try {
        const { goalId } = req.body;
        const userId:number = (req as any).userId;

        if (!goalId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор цели.',
            };
            return res.status(400).json(response);
        }

        await GoalModel.complete(userId, goalId);

        const response: ApiResponse = { success: true };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, `Ошибка при выполнении цели`);

        res.status(500).json(response);
    }
});

router.get('/completed-goals', authGuard, async (req, res) => {
    try {
        const userId:number = (req as any).userId;
        const goals = await GoalModel.getCompleteList(userId);

        const response: ApiResponse = {
            success: true,
            data: { goals }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, `Ошибка при показе списка завершенных целей`);

        res.status(500).json(response);
    }
});

export default router;
