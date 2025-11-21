import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse} from "@/types/indexTypes";
import {ActivityDataStructure} from "@/types/activityTypes";

export async function getActivityList(tokenValue: string | undefined):Promise<ActivityDataStructure[]> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/activity/my-activity-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения списка активностей.";
            try {
                const data = await response.json() as BackendApiResponse<{ activity: ActivityDataStructure[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);
            return [];
        }

        const data = await response.json() as BackendApiResponse<{ activity: ActivityDataStructure[] }>;

        if (!data.success || !data.data?.activity) {
            return [];
        }

        return data.data.activity;
    } catch (error) {
        console.error("Ошибка запроса списка активностей:", error);

        return [];
    }
}