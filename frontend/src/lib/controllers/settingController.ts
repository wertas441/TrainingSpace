import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse, UserProfileRequest} from "@/types/indexTypes";

export async function logout() {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            console.error("logout error: bad status", response.status, response.statusText);
        }

    } catch (error) {
        console.error("logout error:", error);
    }
}

export async function getUserData(tokenValue: string | undefined):Promise<UserProfileRequest | null> {
    try {
        const response = await fetch(`${baseUrlForBackend}/api/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения информации о пользователе.";
            try {
                const data = await response.json() as BackendApiResponse<{ userData: UserProfileRequest }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }

            console.error(errorMessage);
            return null;
        }

        const data = await response.json() as BackendApiResponse<{ userData: UserProfileRequest }>;

        return data.data?.userData ?? null;
    } catch (error) {
        console.error("Ошибка запроса получения данных пользователя:", error);
        return null;
    }
}


