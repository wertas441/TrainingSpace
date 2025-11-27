import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {MainStatisticsCardResponse, NutritionStatisticsCardResponse} from "@/types/statisticsTypes";

export async function getMainStatisticsCardInfo(tokenValue: string | undefined):Promise<MainStatisticsCardResponse | undefined> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/statistics/main-information`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {

            let errorMessage = "Ошибка получения информации для главных карточек статистики.";
            try {
                const data = await response.json() as BackendApiResponse<{ mainCardsData: MainStatisticsCardResponse }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return;
        }

        const data = await response.json() as BackendApiResponse<{ mainCardsData: MainStatisticsCardResponse }>;

        if (!data.success || !data.data?.mainCardsData) {
            return;
        }

        return data.data.mainCardsData;
    } catch (error) {
        console.error("Ошибка запроса информации для главных карточек статистики:", error);

        return;
    }
}

export async function getNutritionStatisticsCardInfo(tokenValue: string | undefined):Promise<NutritionStatisticsCardResponse | undefined> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/statistics/nutrition-information`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {

            let errorMessage = "Ошибка получения информации для карточек питания.";
            try {
                const data = await response.json() as BackendApiResponse<{ nutritionCardData: NutritionStatisticsCardResponse }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return;
        }

        const data = await response.json() as BackendApiResponse<{ nutritionCardData: NutritionStatisticsCardResponse }>;

        if (!data.success || !data.data?.nutritionCardData) {
            return;
        }

        return data.data.nutritionCardData;
    } catch (error) {
        console.error("Ошибка запроса информации для карточек питания:", error);

        return;
    }
}
