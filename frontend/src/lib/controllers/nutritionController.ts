import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types";
import {NutritionDay} from "@/types/nutrition";

export async function getDayList(tokenValue: string):Promise<NutritionDay[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await api.get<BackendApiResponse<{ days: NutritionDay[] }>>('/nutrition/days', payload);

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
        const { data } = await api.get<BackendApiResponse<{ day: NutritionDay }>>(
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

export async function deleteDay(tokenValue: string, dayId: string):Promise<void> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
        data: { dayId },
    }

    try {
        await api.delete<BackendApiResponse>(`/nutrition/day`, payload);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления дня");

        return;
    }
}
