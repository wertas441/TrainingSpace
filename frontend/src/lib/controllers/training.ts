import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {TrainingListResponse} from "@/types/training";

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

export async function deleteTraining(tokenValue: string, trainingId: string):Promise<void> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
        data: { trainingId },
    }

    try {
        await serverApi.delete<BackendApiResponse>(`/training/training`, payload);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления тренировки");

        return;
    }
}
