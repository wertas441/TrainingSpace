import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {TrainingListResponse} from "@/types/trainingTypes";

export async function getTrainingList(tokenValue: string | undefined):Promise<TrainingListResponse[]> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/training/my-training-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {

            let errorMessage = "Ошибка получения списка тренировок.";
            try {
                const data = await response.json() as BackendApiResponse<{ trainings: TrainingListResponse[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return [];
        }

        const data = await response.json() as BackendApiResponse<{ trainings: TrainingListResponse[] }>;

        if (!data.success || !data.data?.trainings) {
            return [];
        }

        return data.data.trainings;
    } catch (error) {
        console.error("Ошибка запроса списка тренировок:", error);

        return [];
    }
}