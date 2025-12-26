import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import type {BackendApiResponse, UserProfileRequest} from "@/types/indexTypes";

export async function logout() {

    try {
        const response = await api.post<BackendApiResponse>(`/auth/logout`);

        if (!response.data.success) return;
        return;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка выхода");
        return;
    }
}

export async function getUserData(tokenValue: string):Promise<UserProfileRequest | undefined> {

    const payload = {
        headers: getTokenHeaders(tokenValue),
    }

    try {
        const response = await api.get<BackendApiResponse<{ userData: UserProfileRequest }>>(
            '/auth/me',
            payload
        );

        if (!response.data.success || !response.data.data?.userData) return undefined;
        return response.data.data.userData;
    } catch (err) {
        console.error(getServerErrorMessage(err) || "Ошибка запроса информации об аккаунте");
        return undefined;
    }
}


