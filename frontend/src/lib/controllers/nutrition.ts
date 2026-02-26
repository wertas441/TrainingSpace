import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {NutritionDay} from "@/types/nutrition";

interface CreateDayPayload {
    name: string;
    description: string;
    date: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}

interface UpdateDayPayload extends CreateDayPayload {
    publicId: string;
}

interface DeleteDayPayload {
    tokenValue: string;
    dayId: string;
}

export async function getDayList(tokenValue: string):Promise<NutritionDay[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ days: NutritionDay[] }>>('/nutrition/days', payload);

        if (!data.success || !data.data?.days) return undefined;

        return data.data.days;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса листа дней");

        return undefined;
    }
}

export async function getDayInformation(tokenValue: string, dayId: string):Promise<NutritionDay | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ day: NutritionDay }>>(
            `/nutrition/about-my-day?dayId=${encodeURIComponent(dayId)}`,
            payload
        );

        if (!data.success || !data.data?.day) return undefined;

        return data.data.day;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса ифнормации о дне");

        return undefined;
    }
}

export async function createDay(payload: CreateDayPayload):Promise<void> {
    try {
        const { data } = await serverApi.post<BackendApiResponse>('/nutrition/day', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось создать день');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка добавления дня";

        console.error(message);
        throw new Error(message);
    }
}

export async function updateDay(payload: UpdateDayPayload):Promise<void> {
    try {
        const { data } = await serverApi.put<BackendApiResponse>('/nutrition/day', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось обновить цель');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка изменения цели";

        console.error(message);
        throw new Error(message);
    }
}

export async function deleteDay(payload: DeleteDayPayload):Promise<void> {

    const requestConfig = {
        headers: getTokenHeaders(payload.tokenValue),
        data: { dayId: payload.dayId },
    }

    try {
        const {data} = await serverApi.delete<BackendApiResponse>(`/nutrition/day`, requestConfig);

        if (!data.success) throw new Error(data.message || "Не удалось удалить день");

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка удаления дня";

        console.error(message);
        throw new Error(message);
    }
}
