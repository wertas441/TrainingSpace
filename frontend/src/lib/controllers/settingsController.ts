import {baseUrlForBackend} from "@/lib";

export async function logOut(tokenValue: string | undefined) {
    try {
         await fetch(`${baseUrlForBackend}/api/auth/logout`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
            cache: 'no-store',
        });

    } catch (error) {
        console.error("Ошибка logout:", error);
    }
}