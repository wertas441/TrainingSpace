import type {BackendApiResponse, UserProfileRequest} from "@/types/indexTypes";
import {api, getServerErrorMessage, getTokenHeaders} from "@/lib";
import {cookies} from "next/headers";

export async function getUserData():Promise<UserProfileRequest | undefined> {

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return undefined;
    }

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

