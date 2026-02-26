import {create, type StateCreator} from "zustand";
import {ExerciseDifficultFilter} from "@/types";

interface ExerciseStore {
    searchName: string;
    difficultFilter: ExerciseDifficultFilter;
    partOfBodyFilter: string[];

    setSearchName: (searchName: string) => void;
    setDifficultFilter: (difficultFilter: ExerciseDifficultFilter) => void;
    setPartOfBodyFilter: (partOfBodyFilter: string[]) => void;

    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    resetFilters: () => void;
}

const initialData = {
    searchName: '',
    difficultFilter: null,
    partOfBodyFilter: [],
}

const exerciseStore: StateCreator<ExerciseStore> = (set) => ({
    ...initialData,

    isFilterWindowOpen: false,

    setSearchName: (searchName) => set({ searchName }),

    setDifficultFilter: (difficultFilter) => set({ difficultFilter }),

    setPartOfBodyFilter: (partOfBodyFilter) => set({ partOfBodyFilter }),

    toggleFilterWindow: () => set((state) => ({ isFilterWindowOpen: !state.isFilterWindowOpen })),

    resetFilters: () => set({...initialData}),
})

export const useExerciseStore = create<ExerciseStore>()(exerciseStore)
