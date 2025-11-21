import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import type {GoalsStructure} from "@/types/goalTypes";

export async function getGoalList(tokenValue: string | undefined):Promise<GoalsStructure[]> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/goal/my-goals-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            // Если backend вернул ошибку, попробуем прочитать тело
            let errorMessage = "Ошибка получения списка целей.";
            try {
                const data = await response.json() as BackendApiResponse<{ goals: GoalsStructure[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);
            return [];
        }

        const data = await response.json() as BackendApiResponse<{ goals: GoalsStructure[] }>;

        if (!data.success || !data.data?.goals) {
            return [];
        }

        return data.data.goals;
    } catch (error) {
        console.error("Ошибка запроса списка целей:", error);
        // В случае сетевой ошибки просто возвращаем пустой список — UI уже умеет с этим работать
        return [];
    }
}