import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {TrainingListResponse} from "@/types/training";

interface CreateTrainingPayload {
    name: string;
    description: string;
    exercises: number[];
}

interface UpdateTrainingPayload {
    trainingId: string;
    name: string;
    description: string;
    exercises: number[];
}

interface DeleteTrainingPayload {
    tokenValue: string;
    trainingId: string;
}

export async function getTrainingList(tokenValue: string):Promise<TrainingListResponse[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ trainings: TrainingListResponse[] }>>('/training/trainings', payload);

        if (!data.success || !data.data?.trainings) return undefined;

        return data.data.trainings;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса листа тренировок");

        return undefined;
    }
}

export async function getTrainingInformation(tokenValue: string, trainingId: string):Promise<TrainingListResponse | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ training: TrainingListResponse }>>(
            `/training/about-my-training?trainingId=${encodeURIComponent(trainingId)}`,
            payload
        );

        if (!data.success || !data.data?.training) return undefined;

        return data.data.training;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса информации о тренировке");

        return undefined;
    }
}

export async function createTraining(payload: CreateTrainingPayload):Promise<void> {
    try {
        const { data } = await serverApi.post<BackendApiResponse>('/training/training', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось создать тренировку');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка создания тренировки";

        console.error(message);
        throw new Error(message);
    }
}

export async function updateTraining(payload: UpdateTrainingPayload):Promise<void> {
    try {
        const { data } = await serverApi.put<BackendApiResponse>('/training/training', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось обновить тренировку');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка обновления тренировки";

        console.error(message);
        throw new Error(message);
    }
}

export async function deleteTraining(payload: DeleteTrainingPayload):Promise<void> {

    const requestConfig = {
        headers: getTokenHeaders(payload.tokenValue),
        data: { trainingId: payload.trainingId },
    }

    try {
        const {data} = await serverApi.delete<BackendApiResponse>(`/training/training`, requestConfig);

        if (!data.success) throw new Error(data.message || "Не удалось удалить тренировку");

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка удаления тренировки";
        console.error(message);
        throw new Error(message);
    }
}
