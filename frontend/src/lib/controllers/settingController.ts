import {baseUrlForBackend} from "@/lib";

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