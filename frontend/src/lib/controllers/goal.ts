import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type { BackendApiResponse } from "@/types";
import {CompleteGoalsStructure, GoalShortyStructure, GoalsStructure} from "@/types/goal";

export async function getGoalList(tokenValue: string):Promise<GoalsStructure[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ goals: GoalsStructure[] }>>('/goal/goals', payload);

        if (!data.success || !data.data?.goals) return undefined;

        return data.data.goals;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса списка целей");

        return undefined;
    }
}

export async function getCompleteGoalList(tokenValue: string):Promise<CompleteGoalsStructure[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ goals: CompleteGoalsStructure[] }>>('/goal/completed-goals', payload);

        if (!data.success || !data.data?.goals) return undefined;

        return data.data.goals;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса списка выполненных целей");

        return undefined;
    }
}


export async function getGoalShortyList(tokenValue: string):Promise<GoalShortyStructure[]> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ goals: GoalShortyStructure[] }>>('/goal/short-goals', payload);

        if (!data.success || !data.data?.goals) return [];

        return data.data.goals;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса короткого списка целей");

        return [];
    }
}

export async function getGoalInformation(tokenValue: string, goalId: string):Promise<GoalsStructure | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const { data } = await serverApi.get<BackendApiResponse<{ goal: GoalsStructure }>>(`/goal/about-my-goal?goalId=${encodeURIComponent(goalId)}`, payload);

        if (!data.success || !data.data?.goal) return undefined;

        return data.data.goal;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса информации о цели");

        return undefined;
    }
}

export async function deleteGoal(tokenValue: string, goalId: string):Promise<void> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
        data: { goalId },
    };

    try {
        await serverApi.delete<BackendApiResponse>(`/goal/goal`, payload);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка удаления цели");

        return;
    }
}

export async function completeGoal(tokenValue: string, goalId: string):Promise<void> {

    const config = {
        headers: getTokenHeaders(tokenValue),
    };

    try {
        await serverApi.put<BackendApiResponse>(`/goal/complete-goal`, { goalId }, config);

        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса о выполнении цели");

        return;
    }
}

