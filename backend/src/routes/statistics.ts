import {Router} from 'express';
import {authGuard} from '../middleware/authMiddleware';
import {config} from '../config';
import {StatisticsModel} from "../models/Statistics";
import {
    MainStatisticsBackendResponse,
    NutritionGraphicBackendResponse,
    NutritionStatisticsBackendResponse
} from "../types/statisticsBackendTypes";
import {ApiResponse} from "../types";
import {showBackendError} from "../lib/indexUtils";

const router = Router();

router.get('/main-information', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        const mainCardsData = await StatisticsModel.getMainInformation(userId);

        const response: ApiResponse<{ mainCardsData: MainStatisticsBackendResponse }> = {
            success: true,
            message: 'main information was get successfully',
            data: { mainCardsData }
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при получении информации для главных карточек');

        res.status(500).json(response);
    }
});

router.get('/nutrition-information', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        const nutritionCardData = await StatisticsModel.getNutritionInformation(userId);

        const response: ApiResponse<{ nutritionCardData: NutritionStatisticsBackendResponse }> = {
            success: true,
            message: 'nutrition information was get successfully',
            data: { nutritionCardData }
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при получении информации для карточек питания');

        res.status(500).json(response);
    }
});

router.get('/nutrition-graphic-info', authGuard, async (req, res) => {
    try {
        const userId = (req as any).userId as number;

        const nutritionGraphicData = await StatisticsModel.getNutritionGraphicInformation(userId);

        const response: ApiResponse<{ graphicData: NutritionGraphicBackendResponse[] }> = {
            success: true,
            message: 'nutrition graphic information was get successfully',
            data: { graphicData: nutritionGraphicData }
        };

        res.status(200).json(response);
    } catch (error) {
        const response = showBackendError(error, 'Ошибка при получении информации для графика питания');

        res.status(500).json(response);
    }
});


export default router;
