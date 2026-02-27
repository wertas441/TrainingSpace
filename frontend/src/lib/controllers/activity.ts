import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {ActivityDataStructure, ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activity";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";

type ExerciseSetInput = { id: number; weight: number; quantity: number };
type ExerciseSetsMap = Record<string, ExerciseSetInput[] | undefined>;
type ExercisePayloadItem = { id: number; try: ExerciseSetInput[] };


interface CreateActivityPayload {
    activityName: string;
    performedAt: string;
    activityType: ActivityTypeStructure;
    activityDifficult: ActivityDifficultyStructure;
    trainingId: number;
    exercises: ExercisePayloadItem;
}

interface UpdateActivityPayload {
    id: string;
    publicId: string;
    name: string;
    description: string;
    activityDate: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    exercises: ExercisePayloadItem;
}

interface DeleteActivityPayload {
    tokenValue: string;
    activityId: string;
}

export async function getActivityList(tokenValue: string):Promise<ActivityDataStructure[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ activity: ActivityDataStructure[] }>>('/activity/activities', payload);

        if (!data.success || !data.data?.activity) return undefined;

        return data.data.activity;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса листа активностей");

        return undefined;
    }
}

export async function getTrainingExercises(trainingId: number): Promise<ExerciseTechniqueItem[]> {
    try {
        const { data } = await serverApi.get<BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>>(`/training/${trainingId}/exercises`);

        if (!data.success || !data.data?.exercises) return [];

        return data.data.exercises;
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
        const { data } = await serverApi.get<BackendApiResponse<{ activity: ActivityDataStructure }>>(
            `/activity/about-my-activity?activityId=${encodeURIComponent(activityId)}`,
            payload
        );

        if (!data.success || !data.data?.activity) return undefined;

        return data.data.activity;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса информации активностей");

        return undefined;
    }
}

export async function createActivity(payload: CreateActivityPayload):Promise<void> {
    try {
        const { data } = await serverApi.post<BackendApiResponse>('/activity/activity', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось добавить активность');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка добавления активности";

        console.error(message);
        throw new Error(message);
    }
}

export async function updateActivity(payload: UpdateActivityPayload):Promise<void> {
    try {
        const { data } = await serverApi.put<BackendApiResponse>('/activity/activity', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось обновить активность');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка изменения активности";

        console.error(message);
        throw new Error(message);
    }
}


export async function deleteActivity(payload: DeleteActivityPayload):Promise<void> {

    const requestConfig = {
        headers: getTokenHeaders(payload.tokenValue),
        data: { activityId: payload.activityId },
    }

    try {
        const { data } = await serverApi.delete<BackendApiResponse>(`/activity/activity`, requestConfig);

        if (!data.success) throw new Error(data.message || "Не удалось удалить активность");

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка удаления активности";

        console.error(message);
        throw new Error(message);
    }
}


const isValidExerciseSet = (set: ExerciseSetInput): boolean =>
    Number.isFinite(set.weight) &&
    set.weight > 0 &&
    Number.isFinite(set.quantity) &&
    set.quantity > 0;

export const buildExercisesPayload = (setsMap: ExerciseSetsMap): ExercisePayloadItem[] =>
    Object.entries(setsMap).reduce<ExercisePayloadItem[]>((acc, [exerciseId, sets]) => {
        const validSets = (sets ?? []).filter(isValidExerciseSet);

        if (validSets.length === 0) {
            return acc;
        }

        acc.push({
            id: Number(exerciseId),
            try: validSets.map(({id, weight, quantity}) => ({id, weight, quantity})),
        });

        return acc;
    }, []);