import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {ActivityDataStructure} from "@/types/activityTypes";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

export async function getActivityList(tokenValue: string | undefined):Promise<ActivityDataStructure[] | undefined> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/activity/my-activity-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения списка активностей.";
            try {
                const data = await response.json() as BackendApiResponse<{ activity: ActivityDataStructure[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ activity: ActivityDataStructure[] }>;

        if (!data.success || !data.data?.activity) {
            return undefined;
        }

        return data.data.activity;
    } catch (error) {
        console.error("Ошибка запроса списка активностей:", error);

        return undefined;
    }
}

// Упражнения, привязанные к конкретной тренировке (для AddActivity)
export async function getTrainingExercises(trainingId: number): Promise<ExerciseTechniqueItem[]> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/training/${trainingId}/exercises`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения упражнений тренировки.";
            try {
                const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);
            return [];
        }

        const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;

        if (!data.success || !data.data?.exercises) {
            return [];
        }

        return data.data.exercises;
    } catch (error) {
        console.error("Ошибка запроса упражнений тренировки:", error);
        return [];
    }
}

export async function getActivityInformation(tokenValue: string | undefined, activityId: number):Promise<ActivityDataStructure | null> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/activity/about-my-activity?activityId=${encodeURIComponent(String(activityId))}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения информации об активности .";
            try {
                const data = await response.json() as BackendApiResponse<{ activity: ActivityDataStructure }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return null;
        }

        const data = await response.json() as BackendApiResponse<{ activity: ActivityDataStructure }>;

        return data.data?.activity ?? null;
    } catch (error) {
        console.error("Ошибка запроса информации об активности:", error);
        return null;
    }
}

export async function deleteActivity(tokenValue: string | undefined, activityId: number):Promise<void> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/activity/delete-my-activity`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            body: JSON.stringify({activityId: activityId}),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка удаления активности.";
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
            console.error(data.error || data.message || "Ошибка удаления активности.");
        }

        return;
    } catch (error) {
        console.error("Ошибка запроса удаления активности:", error);
        return;
    }
}
