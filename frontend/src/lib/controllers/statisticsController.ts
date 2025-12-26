import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {
    MainStatisticsCardResponse,
    NutritionStatisticsCardResponse,
    NutritionStatisticsGraphicResponse
} from "@/types/statisticsTypes";

export async function getMainStatisticsCardInfo(tokenValue: string):Promise<MainStatisticsCardResponse | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ mainCardsData: MainStatisticsCardResponse }>>(
            '/statistics/main-information',
            payload
        );

        if (!response.data.success || !response.data.data?.mainCardsData) return undefined;
        return response.data.data.mainCardsData;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка получения общей статистической информации ");
        return undefined;
    }
}

export async function getNutritionStatisticsCardInfo(tokenValue: string):Promise<NutritionStatisticsCardResponse | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ nutritionCardData: NutritionStatisticsCardResponse }>>(
            '/statistics/nutrition-information',
            payload
        );

        if (!response.data.success || !response.data.data?.nutritionCardData) return undefined;
        return response.data.data.nutritionCardData;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка получения информации о питании");
        return undefined;
    }
}

export async function getNutritionGraphicInfo(tokenValue: string):Promise<NutritionStatisticsGraphicResponse[]> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ graphicData: NutritionStatisticsGraphicResponse[] }>>(
            '/statistics/nutrition-graphic-info',
            payload
        );

        if (!response.data.success || !response.data.data?.graphicData) return [];
        return response.data.data.graphicData;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка получения информации для графика питания");
        return [];
    }
}
