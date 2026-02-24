'use client'

import {create, type StateCreator} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
    theme: Theme;
    initTheme: () => void;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const applyThemeClass = (theme: Theme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

const getSystemTheme = (): Theme => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const themeStore: StateCreator<ThemeStore> = (set) => ({
    theme: 'light',

    initTheme: () => {
        const initialTheme = getSystemTheme();
        applyThemeClass(initialTheme);
        set({theme: initialTheme});
    },

    toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        applyThemeClass(nextTheme);
        return {theme: nextTheme};
    }),

    setTheme: (theme) => {
        applyThemeClass(theme);
        set({theme});
    },
})

export const useThemeStore = create<ThemeStore>()(
    persist(themeStore, {
        name: "TSThemeStore",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
            if (!state) return;
            applyThemeClass(state.theme);
        },
    })
)

