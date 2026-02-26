import {serverApi, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type { BackendApiResponse } from "@/types";
import {CompleteGoalsStructure, GoalPriority, GoalShortyStructure, GoalsStructure} from "@/types/goal";

interface CreateGoalPayload {
    name: string;
    description: string;
    priority: GoalPriority;
}

interface UpdateGoalPayload {
    goalId: string;
    name: string;
    description: string;
    priority: GoalPriority;
}

interface DeleteGoalPayload {
    tokenValue: string;
    goalId: string;
}

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

export async function deleteGoal(payload: DeleteGoalPayload):Promise<void> {

    const requestConfig = {
        headers: getTokenHeaders(payload.tokenValue),
        data: { goalId: payload.goalId },
    }

    try {
        const {data} = await serverApi.delete<BackendApiResponse>(`/goal/goal`, requestConfig);

        if (!data.success) throw new Error(data.message || "Не удалось удалить цель");

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка удаления цели";

        console.error(message);
        throw new Error(message);
    }
}

export async function createGoal(payload: CreateGoalPayload):Promise<void> {
    try {
        const { data } = await serverApi.post<BackendApiResponse>('/goal/goal', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось создать цель');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка добавления цели";

        console.error(message);
        throw new Error(message);
    }
}

export async function completeGoal(tokenValue: string, goalId: string):Promise<void> {

    const config = {
        headers: getTokenHeaders(tokenValue),
    };

    try {
        const { data } = await serverApi.put<BackendApiResponse>(`/goal/complete-goal`, { goalId }, config);

        if (!data.success) throw new Error(data.message || 'Не удалось отметить цель как выполненную');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка запроса о выполнении цели";

        console.error(message);
        throw new Error(message);
    }
}

export async function updateGoal(payload: UpdateGoalPayload):Promise<void> {
    try {
        const { data } = await serverApi.put<BackendApiResponse>('/goal/goal', payload);

        if (!data.success) throw new Error(data.message || 'Не удалось обновить цель');

        return;
    } catch (err) {
        const message = getServerErrorMessage(err) || "Ошибка изменения цели";

        console.error(message);
        throw new Error(message);
    }
}

