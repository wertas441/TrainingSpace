import { Router } from 'express';
import { authGuard } from '../middleware/authMiddleware';
import {UserModel} from "../models/User";
import {ApiResponse} from "../types";
import {AddTrainingFrontendStructure, TrainingListFrontendStructure} from "../types/trainingBackendTypes";

const router = Router();

router.post('/training/add-new-training', authGuard, async (req, res) => {
    const {name, description, exercises, date}: AddTrainingFrontendStructure = req.body;


});

router.get('/training/my-training-list', authGuard, async (req, res) => {
    const {id, name, description, exercises}: TrainingListFrontendStructure = req.body;

});

router.delete('/training/delete-my-training', authGuard, async (req, res) => {

});

router.put('/training/change-my-training', authGuard, async (req, res) => {

});


export default router;
