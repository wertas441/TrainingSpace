import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {ActivityDataStructure} from "@/types/activity";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";

type ExerciseSetInput = { id: number; weight: number; quantity: number };
type ExerciseSetsMap = Record<string, ExerciseSetInput[] | undefined>;
type ExercisePayloadItem = { id: number; try: ExerciseSetInput[] };

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

export async function deleteActivity(tokenValue: string, activityId: string):Promise<void> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
        data: { activityId },
    }

    try {
        await serverApi.delete<BackendApiResponse>(`/activity/activity`, payload);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления активности");

        return;
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