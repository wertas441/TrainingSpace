import {create, type StateCreator} from "zustand";

interface NutritionStore {
    searchName: string;
    searchDate: string;
    caloriesMin: string;
    caloriesMax: string;
    proteinMin: string;
    proteinMax: string;
    fatMin: string;
    fatMax: string;
    carbMin: string;
    carbMax: string;

    setFilterData: (label: string, data: string) => void;

    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    resetFilters: () => void;
}

const initialData = {
    searchName: '',
    searchDate: '',
    caloriesMin: '',
    caloriesMax: '',
    proteinMin: '',
    proteinMax: '',
    fatMin: '',
    fatMax: '',
    carbMin: '',
    carbMax: '',
}

const nutritionStore: StateCreator<NutritionStore> = (set) => ({
    ...initialData,

    isFilterWindowOpen: false,

    setFilterData: (label, data) => set({[label]: data}),

    toggleFilterWindow: () => set((state) => ({ isFilterWindowOpen: !state.isFilterWindowOpen })),

    resetFilters: () => set({...initialData}),
})

export const useNutritionStore = create<NutritionStore>()(nutritionStore)
