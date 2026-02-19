'use client'

import {createContext, ReactNode, useCallback, useContext, useMemo, useState} from "react";

export interface NutritionFilters {
    searchName: string;
    searchDate: string;
    caloriesMin: number;
    caloriesMax: number;
    proteinMin: number;
    proteinMax: number;
    fatMin: number;
    fatMax: number;
    carbMin: number;
    carbMax: number;
}

const initialNutritionFilters: NutritionFilters = {
    searchName: "",
    searchDate: "",
    caloriesMin: Number.NaN,
    caloriesMax: Number.NaN,
    proteinMin: Number.NaN,
    proteinMax: Number.NaN,
    fatMin: Number.NaN,
    fatMax: Number.NaN,
    carbMin: Number.NaN,
    carbMax: Number.NaN,
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
