import { baseUrlForBackend } from "@/lib";
import type { BackendApiResponse } from "@/types/indexTypes";
import {GoalShortyStructure, GoalsStructure} from "@/types/goalTypes";

export async function getGoalList(tokenValue: string | undefined):Promise<GoalsStructure[] | undefined> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/goal/my-goals-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения списка целей.";
            try {
                const data = await response.json() as BackendApiResponse<{ goals: GoalsStructure[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ goals: GoalsStructure[] }>;

        if (!data.success || !data.data?.goals) {
            return undefined;
        }

        return data.data.goals;
    } catch (error) {
        console.error("Ошибка запроса списка целей:", error);

        return undefined;
    }
}

export async function getGoalShortyList(tokenValue: string):Promise<GoalShortyStructure[]> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/goal/my-shorty-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения короткого списка целей.";
            try {
                const data = await response.json() as BackendApiResponse<{ goals: GoalShortyStructure[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);

            return [];
        }

        const data = await response.json() as BackendApiResponse<{ goals: GoalShortyStructure[] }>;

        if (!data.success || !data.data?.goals) {
            return [];
        }

        return data.data.goals;
    } catch (error) {
        console.error("Ошибка запроса короткого списка целей:", error);

        return [];
    }
}

export async function getGoalInformation(tokenValue: string, goalId: number):Promise<GoalsStructure | undefined> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/goal/about-my-goal?goalId=${encodeURIComponent(String(goalId))}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения информации о цели.";
            try {
                const data = await response.json() as BackendApiResponse<{ goal: GoalsStructure }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ goal: GoalsStructure }>;

        return data.data?.goal ?? undefined;
    } catch (error) {
        console.error("Ошибка запроса списка целей:", error);
        return undefined;
    }
}

export async function deleteGoal(tokenValue: string | undefined, goalId: number):Promise<void> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/goal/delete-my-goal`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            body: JSON.stringify({goalId: goalId}),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка удаления цели.";
            try {
                const data = await response.json() as BackendApiResponse;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return;
        }

        const data = await response.json() as BackendApiResponse;

        if (!data.success) {
            console.error(data.error || data.message || "Ошибка удаления цели.");
        }

        return;
    } catch (error) {
        console.error("Ошибка запроса удаления цели:", error);
        return;
    }
}

export async function completeGoal(tokenValue: string | undefined, goalId: number):Promise<void> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/goal/complete-my-goal`, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            body: JSON.stringify({goalId: goalId}),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка выполнения цели.";
            try {
                const data = await response.json() as BackendApiResponse;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return;
        }

        const data = await response.json() as BackendApiResponse;

        if (!data.success) {
            console.error(data.error || data.message || "Ошибка выполнения цели.");
        }

        return;
    } catch (error) {
        console.error("Ошибка запроса выполнения цели:", error);
        return;
    }
}

