import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {NutritionDay} from "@/types/nutritionTypes";

export async function getDayList(tokenValue: string):Promise<NutritionDay[] | undefined> {
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

            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ days: NutritionDay[] }>;

        if (!data.success || !data.data?.days) {
            return undefined;
        }

        return data.data.days;
    } catch (error) {
        console.error("Ошибка запроса списка дней:", error);

        return undefined;
    }
}

export async function getDayInformation(tokenValue: string, dayId: number):Promise<NutritionDay | undefined> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/nutrition/about-my-day?dayId=${encodeURIComponent(String(dayId))}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения информации о цели.";
            try {
                const data = await response.json() as BackendApiResponse<{ day: NutritionDay }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ day: NutritionDay }>;

        return data.data?.day ?? undefined;
    } catch (error) {
        console.error("Ошибка запроса списка целей:", error);
        return undefined;
    }
}

export async function deleteDay(tokenValue: string | undefined, dayId: number):Promise<void> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/nutrition/delete-my-day`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            body: JSON.stringify({dayId: dayId}),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка удаления дня.";
            try {
                const data = await response.json() as BackendApiResponse;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return;
        }

        const data = await response.json() as BackendApiResponse;

        if (!data.success) {
            console.error(data.error || data.message || "Ошибка удаления дня.");
        }

        return;
    } catch (error) {
        console.error("Ошибка запроса удаления дня:", error);
        return;
    }
}
