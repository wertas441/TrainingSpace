import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {ActivityDataStructure} from "@/types/activityTypes";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

export async function getActivityList(tokenValue: string):Promise<ActivityDataStructure[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ activity: ActivityDataStructure[] }>>(
            '/activity/activities',
            payload
        );

        if (!response.data.success || !response.data.data?.activity) return undefined;

        return response.data.data.activity;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса листа активностей");

        return undefined;
    }
}

// Упражнения, привязанные к конкретной тренировке
export async function getTrainingExercises(trainingId: number): Promise<ExerciseTechniqueItem[]> {
    try {
        const resp = await api.get<BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>>(
            `/training/${trainingId}/exercises`
        );

        if (!resp.data.success || !resp.data.data?.exercises) return [];

        return resp.data.data.exercises;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса упражнений тренировки");

        return [];
    }
}

export async function getActivityInformation(tokenValue: string, activityId: string):Promise<ActivityDataStructure | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ activity: ActivityDataStructure }>>(
            `/activity/about-my-activity?activityId=${encodeURIComponent(activityId)}`,
            payload
        );

        if (!response.data.success || !response.data.data?.activity) return undefined;

        return response.data.data.activity;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса информации активностей");

        return undefined;
    }
}

export async function deleteActivity(tokenValue: string, activityId: string):Promise<void> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
        data: { activityId },
    }

    try {
        await api.delete<BackendApiResponse>(`/activity/activity`, payload);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления активности");

        return;
    }
}
