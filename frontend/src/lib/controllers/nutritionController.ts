import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {NutritionDay} from "@/types/nutritionTypes";


export async function getDayList(tokenValue: string | undefined):Promise<NutritionDay[]> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/nutrition/my-day-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения списка дней.";
            try {
                const data = await response.json() as BackendApiResponse<{ days: NutritionDay[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {

            }
            console.error(errorMessage);
            return [];
        }

        const data = await response.json() as BackendApiResponse<{ days: NutritionDay[] }>;

        if (!data.success || !data.data?.days) {
            return [];
        }

        return data.data.days;
    } catch (error) {
        console.error("Ошибка запроса списка дней:", error);

        return [];
    }
}