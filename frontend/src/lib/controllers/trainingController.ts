import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {TrainingListResponse} from "@/types/trainingTypes";

export async function getTrainingList(tokenValue: string):Promise<TrainingListResponse[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ trainings: TrainingListResponse[] }>>(
            '/training/trainings',
            payload
        );

        if (!response.data.success || !response.data.data?.trainings) return undefined;
        return response.data.data.trainings;
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
        const response = await api.get<BackendApiResponse<{ training: TrainingListResponse }>>(
            `/training/training?trainingId=${encodeURIComponent(trainingId)}`,
            payload
        );

        if (!response.data.success || !response.data.data?.training) return undefined;
        return response.data.data.training;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса информации о тренировоке");
        return undefined;
    }
}

export async function deleteTraining(tokenValue: string, trainingId: string):Promise<void> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
        data: { trainingId },
    }

    try {
        const response = await api.delete<BackendApiResponse>(
            `/training/delete`,
            payload
        );

        if (!response.data.success) return;
        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления тренировки");
        return;
    }
}
