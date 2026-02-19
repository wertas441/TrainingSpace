'use client'

import {createContext, ReactNode, useCallback, useContext, useMemo, useState} from "react";

export interface NutritionFilters {
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
}

const initialNutritionFilters: NutritionFilters = {
    searchName: "",
    searchDate: "",
    caloriesMin: "",
    caloriesMax: "",
    proteinMin: "",
    proteinMax: "",
    fatMin: "",
    fatMax: "",
    carbMin: "",
    carbMax: "",
};

interface NutritionFiltersContextValue {
    filters: NutritionFilters;
    setFilter: <K extends keyof NutritionFilters>(key: K, value: NutritionFilters[K]) => void;
    resetFilters: () => void;
}

const NutritionFiltersContext = createContext<NutritionFiltersContextValue | undefined>(undefined);

export function NutritionFiltersProvider({children}: {children: ReactNode}) {

    const [filters, setFilters] = useState<NutritionFilters>(initialNutritionFilters);

    const setFilter = useCallback(
        <K extends keyof NutritionFilters>(key: K, value: NutritionFilters[K]) => {setFilters((prev) => ({...prev, [key]: value}));
        }, []
    );

    const resetFilters = useCallback(() => setFilters(initialNutritionFilters), []);

    const contextValue = useMemo(
        () => ({filters, setFilter, resetFilters}
    ), [filters, setFilter, resetFilters]);

    return (
        <NutritionFiltersContext.Provider value={contextValue}>
            {children}
        </NutritionFiltersContext.Provider>
    );
}

export function useNutritionFilters() {
    const context = useContext(NutritionFiltersContext);

    if (!context) {
        throw new Error("useNutritionFilters error");
    }

    return context;
}
