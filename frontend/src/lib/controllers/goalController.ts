import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type { BackendApiResponse } from "@/types/indexTypes";
import {CompleteGoalsStructure, GoalShortyStructure, GoalsStructure} from "@/types/goalTypes";

export async function getGoalList(tokenValue: string):Promise<GoalsStructure[] | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ goals: GoalsStructure[] }>>(
            '/goal/my-goals-list',
            payload
        );

        if (!response.data.success || !response.data.data?.goals) return undefined;
        return response.data.data.goals;
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
        const response = await api.get<BackendApiResponse<{ goals: CompleteGoalsStructure[] }>>(
            '/goal/my-complete-list',
            payload
        );

        if (!response.data.success || !response.data.data?.goals) return undefined;
        return response.data.data.goals;
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
        const response = await api.get<BackendApiResponse<{ goals: GoalShortyStructure[] }>>(
            '/goal/my-shorty-list',
            payload
        );

        if (!response.data.success || !response.data.data?.goals) return [];
        return response.data.data.goals;
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
        const response = await api.get<BackendApiResponse<{ goal: GoalsStructure }>>(
            `/goal/about-my-goal?goalId=${encodeURIComponent(goalId)}`,
            payload
        );

        if (!response.data.success || !response.data.data?.goal) return undefined;
        return response.data.data.goal;
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
        const response = await api.delete<BackendApiResponse>(
            `/goal/delete-my-goal`,
            payload
        );

        if (!response.data.success) return;
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
        const response = await api.put<BackendApiResponse>(
            `/goal/complete-my-goal`,
            { goalId },
            config
        );

        if (!response.data.success) return;
        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса о выполнении цели");
        return;
    }
}

