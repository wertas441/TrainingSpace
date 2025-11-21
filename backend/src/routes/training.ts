import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {ApiResponse} from "../types";
import {AddTrainingFrontendStructure} from "../types/trainingBackendTypes";
import { config } from '../config';
import {
    validateTrainingDescription,
    validateTrainingExercises,
    validateTrainingName
} from "../lib/backendValidators/trainingValidators";
import {TrainingModel} from "../models/Training";

const router = Router();

router.post('/add-new-training', authGuard, async (req, res) => {
    const {name, description, exercises}: AddTrainingFrontendStructure = req.body;

    const trainingNameError:boolean = validateTrainingName(name);
    const trainingDescriptionError:boolean = validateTrainingDescription(description);
    const exercisesError:boolean = validateTrainingExercises(exercises);

    const userId = (req as any).userId as number;

    if (!trainingNameError || !trainingDescriptionError || !exercisesError) {
        const response: ApiResponse = {
            success: false,
            error: 'Ошибка добавления новой тренировки, пожалуйста проверьте введенные вами данные.'
        };
        return res.status(400).json(response);
    }

    await TrainingModel.create({user_id: userId, name, description, exercises});

    const response: ApiResponse = {
        success: true,
        message: 'training created successfully',
    };

    res.status(200).json(response);
});

router.get('/my-training-list', authGuard, async (req, res) => {
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

        console.error('Ошибка показа списка тренировок', error);
        const err: any = error;
        const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
        const response: ApiResponse = {
            success: false,
            error: `Ошибка при показе списка тренировок ${devSuffix}`
        };

        res.status(500).json(response);
    }

});

router.delete('/delete-my-training', authGuard, async (req, res) => {

});

router.put('/change-my-training', authGuard, async (req, res) => {

});


export default router;
