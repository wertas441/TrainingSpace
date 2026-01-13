import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {NutritionDay} from "@/types/nutritionTypes";

export async function getDayList(tokenValue: string):Promise<NutritionDay[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ days: NutritionDay[] }>>(
            '/nutrition/days',
            payload
        );

        if (!response.data.success || !response.data.data?.days) return undefined;
        return response.data.data.days;
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
        const response = await api.get<BackendApiResponse<{ day: NutritionDay }>>(
            `/nutrition/day?dayId=${encodeURIComponent(dayId)}`,
            payload
        );

        if (!response.data.success || !response.data.data?.day) return undefined;
        return response.data.data.day;
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
        const response = await api.delete<BackendApiResponse>(
            `/nutrition/delete`,
            payload
        );

        if (!response.data.success) return;
        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления дня");
        return;
    }
}
