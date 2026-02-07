import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {
    AddTrainingFrontendStructure,
    TrainingUpdateFrontendStructure
} from "../types/training";
import {
    validateTrainingDescription,
    validateTrainingExercises,
    validateTrainingName
} from "../lib/backendValidators/training";
import {TrainingModel} from "../models/Training";
import {ExerciseModel} from "../models/Exercise";
import {showBackendError} from "../lib/indexUtils";

const router = Router();

router.post('/training', authGuard, async (req, res) => {
    try {
        const { requestData }: {requestData: AddTrainingFrontendStructure} = req.body;

        const trainingNameError:boolean = validateTrainingName(requestData.name);
        const trainingDescriptionError:boolean = validateTrainingDescription(requestData.description);
        const exercisesError:boolean = validateTrainingExercises(requestData.exercises);

        const userId = (req as any).userId as number;

        if (!trainingNameError || !trainingDescriptionError || !exercisesError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка добавления новой тренировки, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await TrainingModel.create(userId, requestData);

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при добавлении новой тренировки');

        res.status(500).json(response);
    }
});

router.get('/trainings', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const trainings = await TrainingModel.getList(userId);

        const response: ApiResponse = {
            success: true,
            message: 'success of getting list of trainings',
            data: { trainings }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при показе списка тренировок');

        res.status(500).json(response);
    }
});

// Упражнения конкретной тренировки пользователя
router.get('/:id/exercises', authGuard, async (req, res) => {
    try {
        const trainingId = Number(req.params.id);

        if (!Number.isFinite(trainingId)) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный id тренировки',
            };
            return res.status(400).json(response);
        }

        const userId = (req as any).userId as number;
        const exercises = await ExerciseModel.getByTrainingId(trainingId, userId);

        const response: ApiResponse = {
            success: true,
            data: { exercises },
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при показе упражнений тренировки');

        res.status(500).json(response);
    }
});

router.get('/about-my-training', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;
        const trainingPublicId = String(req.query.trainingId || '').trim();

        if (!trainingPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор тренировки.',
            };
            return res.status(400).json(response);
        }

        const training = await TrainingModel.information(userId, trainingPublicId);

        if (!training) {
            const response: ApiResponse = {
                success: false,
                error: 'Тренировка не найдена или у вас нет к ней доступа.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
            data: { training }
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при получении информации о тренировке');

        res.status(500).json(response);
    }
});

router.delete('/training', authGuard, async (req, res) => {
    try {
        const { trainingId } = req.body;
        const userId = (req as any).userId as number;

        const trainingPublicId = String(trainingId || '').trim();

        if (!trainingPublicId) {
            const response: ApiResponse = {
                success: false,
                error: 'Некорректный идентификатор тренировки.',
            };
            return res.status(400).json(response);
        }

        const isDeleted = await TrainingModel.delete(userId, trainingPublicId);

        if (!isDeleted) {
            const response: ApiResponse = {
                success: false,
                error: 'Тренировка не найдена или у вас нет доступа для ее удаления.',
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, '`Ошибка при удалении тренировки');

        res.status(500).json(response);
    }
});

router.put('/training', authGuard, async (req, res) => {
    try {
        const { requestData }: {requestData: TrainingUpdateFrontendStructure} = req.body;
        const userId = (req as any).userId as number;

        const trainingNameError:boolean = validateTrainingName(requestData.name);
        const trainingDescriptionError:boolean = validateTrainingDescription(requestData.description);
        const exercisesError:boolean = validateTrainingExercises(requestData.exercises);

        if (!trainingNameError || !trainingDescriptionError || !exercisesError) {
            const response: ApiResponse = {
                success: false,
                error: 'Ошибка изменения тренировки, пожалуйста проверьте введенные вами данные.'
            };
            return res.status(400).json(response);
        }

        await TrainingModel.update(userId, requestData);

        const response: ApiResponse = {
            success: true,
        };

        res.status(200).json(response);
    } catch (error){
        const response = showBackendError(error, 'Ошибка при изменении тренировки');

        res.status(500).json(response);
    }
});


export default router;
