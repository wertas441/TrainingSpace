import {create, type StateCreator} from "zustand";
import {ActivityDifficultyFilter, ActivityTypeFilter} from "@/types/activity";

interface ActivityStore {
    searchName: string;
    searchDate: string;
    difficultFilter: ActivityDifficultyFilter;
    typeFilter: ActivityTypeFilter;

    setSearchName: (searchName: string) => void;
    setSearchDate: (searchDate: string) => void;

    setDifficultFilter: (difficultFilter: ActivityDifficultyFilter) => void;
    setTypeFilter: (typeFilter: ActivityTypeFilter) => void;

    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    resetFilters: () => void;
}

const initialData = {
    searchName: '',
    searchDate: '',
    difficultFilter: null,
    typeFilter: null,
}

const activityStore: StateCreator<ActivityStore> = (set) => ({
    ...initialData,

    isFilterWindowOpen: false,

    setSearchName: (searchName) => set({ searchName }),

    setSearchDate: (searchDate) => set({ searchDate }),

    setDifficultFilter: (difficultFilter) => set({ difficultFilter }),

    setTypeFilter: (typeFilter) => set({ typeFilter }),

    toggleFilterWindow: () => set((state) => ({ isFilterWindowOpen: !state.isFilterWindowOpen })),

    resetFilters: () => set({...initialData}),
})

export const useActivityStore = create<ActivityStore>()(activityStore)
