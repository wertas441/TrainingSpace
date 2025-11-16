import {Ref} from "react";

export interface NutritionDay {
    id: number | string;
    name: string;
    date: string;
    description?: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}

export interface NutritionHeaderProps {
    searchName: string;
    onSearchNameChange: (newValue: string) => void;
    searchDate: string; // формат YYYY-MM-DD
    onSearchDateChange: (newValue: string) => void;
    caloriesMin: number;
    onCaloriesMinChange: (newValue: number) => void;
    caloriesMax: number;
    onCaloriesMaxChange: (newValue: number) => void;
    proteinMin: number;
    onProteinMinChange: (newValue: number) => void;
    proteinMax: number;
    onProteinMaxChange: (newValue: number) => void;
    fatMin: number;
    onFatMinChange: (newValue: number) => void;
    fatMax: number;
    onFatMaxChange: (newValue: number) => void;
    carbMin: number;
    onCarbMinChange: (newValue: number) => void;
    carbMax: number;
    onCarbMaxChange: (newValue: number) => void;
    isFilterWindowOpen: boolean;
    ref: Ref<HTMLDivElement>;
    toggleFilterWindow: () => void;
    onResetFilters: () => void;
}
