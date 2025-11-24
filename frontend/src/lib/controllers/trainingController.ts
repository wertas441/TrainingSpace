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

export async function getTrainingInformation(tokenValue: string | undefined, trainingId: number):Promise<TrainingListResponse | null> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/training/about-my-training?trainingId=${encodeURIComponent(String(trainingId))}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения информации о тренировке.";
            try {
                const data = await response.json() as BackendApiResponse<{ training: TrainingListResponse }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return null;
        }

        const data = await response.json() as BackendApiResponse<{ training: TrainingListResponse }>;

        return data.data?.training ?? null;
    } catch (error) {
        console.error("Ошибка запроса информаации о тренировке:", error);
        return null;
    }
}

export async function deleteTraining(tokenValue: string | undefined, trainingId: number):Promise<void> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/training/delete-my-training`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            body: JSON.stringify({trainingId}),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка удаления тренировки.";
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
            console.error(data.error || data.message || "Ошибка удаления тренировки.");
        }

        return;
    } catch (error) {
        console.error("Ошибка запроса удаления тренировки:", error);
        return;
    }
}
