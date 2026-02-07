import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {TrainingListResponse} from "@/types/training";
import {ExerciseTechniqueItem} from "@/types/exercise";

export async function getExercisesList(tokenValue: string):Promise<ExerciseTechniqueItem[] | undefined>{

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await api.get<BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>>('/exercises/exercises', payload);

        if (!data.success || !data.data?.exercises) return undefined;

        return data.data.exercises;
    } catch (error) {
        console.error(getServerErrorMessage(error) || "Ошибка запроса листа тренировок");

        return undefined;
    }
}

export async function getTrainingList(tokenValue: string):Promise<TrainingListResponse[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await api.get<BackendApiResponse<{ trainings: TrainingListResponse[] }>>('/training/trainings', payload);

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
        const { data } = await api.get<BackendApiResponse<{ training: TrainingListResponse }>>(
            `/training/about-my-training?trainingId=${encodeURIComponent(trainingId)}`, payload);

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
        await api.delete<BackendApiResponse>(`/training/training`, payload);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления тренировки");

        return;
    }
}
