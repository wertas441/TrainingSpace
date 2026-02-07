import { create, type StateCreator } from "zustand";
import type { BackendApiResponse, UserProfileRequest } from "@/types";
import { api, getServerErrorMessage } from "@/lib";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
    userData: UserProfileRequest | null;

    initUserData: () => Promise<void>;
    fetchUserData: () => Promise<UserProfileRequest | undefined>;

    getUserData: () => UserProfileRequest | null;
    changeEmail: (email: string) => void;
    logout: () => Promise<void>;
}

const userStore: StateCreator<UserStore> = (set, get) => ({
    userData: null,
    getUserData: () => get().userData,

    initUserData: async () => {
        if (get().userData) return;
        await get().fetchUserData();
    },

    fetchUserData: async () => {
        try {
            const response = await api.get<BackendApiResponse<{ userData: UserProfileRequest }>>(
                "/user/me",
            );

            if (!response.data.success || !response.data.data?.userData) return undefined;

            const userData = response.data.data.userData;
            set({userData});
            return userData;
        } catch (err) {
            console.error(getServerErrorMessage(err) || "Ошибка запроса информации об аккаунте");
            return undefined;
        }
    },

    changeEmail: (email) =>
        set((s) => ({
            userData: s.userData ? { ...s.userData, email } : s.userData,
        })),

    logout: async () => {
        try {
            const response = await api.post<BackendApiResponse>(`/auth/logout`);

            if (!response.data.success) return;

            set({userData: null});
            return;
        } catch (err) {
            console.error(getServerErrorMessage(err) || "Ошибка выхода");
            return;
        }
    },
})

export const useUserStore = create<UserStore>()(
    persist(userStore, {
        name: "userStore",
        storage: createJSONStorage(() => localStorage)
    })
)

export const getUserData = (s: UserStore) => s.userData;
export const makeLogout = (s: UserStore) => s.logout;
export const makeInitUserData = (s: UserStore) => s.initUserData;