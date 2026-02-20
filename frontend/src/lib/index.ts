import {BackendApiResponse} from "@/types";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import axios from "axios";

export function getTokenHeaders(token: string) {
    return {Cookie: `token=${token}`};
}

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

export async function getExercisesList():Promise<ExerciseTechniqueItem[] | undefined>{
    try {
        const { data } = await api.get<BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>>('/exercises/exercises');

        if (!data.success || !data.data?.exercises) return undefined;

        return data.data.exercises;
    } catch (error) {
        console.error("Ошибка запроса списка упражнений:", error);

        return undefined;
    }
}

export const normalizeToYMD = (dateStr: string): string => {
    const s = String(dateStr ?? '').trim();
    if (!s) return '';

    // already ISO date
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // legacy backend / UI formats: DD-MM-YYYY or DD.MM.YYYY
    const m = s.match(/^(\d{2})[.-](\d{2})[.-](\d{4})$/);
    if (m) {
        const [, dd, mm, yyyy] = m;
        return `${yyyy}-${mm}-${dd}`;
    }

    // fallback: try native Date parsing
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${mo}-${day}`;
};

