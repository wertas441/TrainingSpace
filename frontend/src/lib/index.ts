import {BackendApiResponse} from "@/types/indexTypes";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import axios from "axios";

export const baseUrlForBackend: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3002';
export const showErrorMessage:boolean = true;

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3002/api',
    withCredentials: true,
    timeout: 9000,
});

export function getServerErrorMessage(err: unknown){
    let message:string = 'Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.';

    if (axios.isAxiosError<BackendApiResponse>(err)) {
        const respData = err.response?.data;
        message = respData?.error || respData?.message || message;
    }

    return message;
}

export async function getExercisesList(tokenValue: string | undefined):Promise<ExerciseTechniqueItem[] | undefined>{
    try {
        const response = await fetch(`${baseUrlForBackend}/api/exercises/exercises-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения списка упражнений.";
            try {
                const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;

        if (!data.success || !data.data?.exercises) {

            return undefined;
        }

        return data.data.exercises;
    } catch (error) {
        console.error("Ошибка запроса списка упражнений:", error);

        return undefined;
    }
}



