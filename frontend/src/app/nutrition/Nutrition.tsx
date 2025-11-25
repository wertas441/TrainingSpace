'use client'

import NutritionHeader from "@/components/UI/headers/NutritionHeader";
import {NutritionDay} from "@/types/nutritionTypes";
import NutritionDayItem from "@/components/elements/NutritionDayRow";
import {useCallback, useEffect, useMemo, useState} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/MainPagination";

export default function Nutrition({userDays = []}: {userDays?: NutritionDay[]}) {

    const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false);
    const [searchName, setSearchName] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');
    const [caloriesMin, setCaloriesMin] = useState<number>(Number.NaN);
    const [caloriesMax, setCaloriesMax] = useState<number>(Number.NaN);
    const [proteinMin, setProteinMin] = useState<number>(Number.NaN);
    const [proteinMax, setProteinMax] = useState<number>(Number.NaN);
    const [fatMin, setFatMin] = useState<number>(Number.NaN);
    const [fatMax, setFatMax] = useState<number>(Number.NaN);
    const [carbMin, setCarbMin] = useState<number>(Number.NaN);
    const [carbMax, setCarbMax] = useState<number>(Number.NaN);
    const itemsPerPage:number = 10;

    const toggleFilterWindow = useCallback(() => {
        setIsFilterWindowOpen(!isFilterWindowOpen);
    }, [isFilterWindowOpen]);

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        const isSet = (n: number) => Number.isFinite(n);
        const cMin = isSet(caloriesMin) ? caloriesMin : undefined;
        const cMax = isSet(caloriesMax) ? caloriesMax : undefined;
        const pMin = isSet(proteinMin) ? proteinMin : undefined;
        const pMax = isSet(proteinMax) ? proteinMax : undefined;
        const fMin = isSet(fatMin) ? fatMin : undefined;
        const fMax = isSet(fatMax) ? fatMax : undefined;
        const cbMin = isSet(carbMin) ? carbMin : undefined;
        const cbMax = isSet(carbMax) ? carbMax : undefined;

        return userDays.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesData = searchDate === '' || e.date === searchDate;
            const byCaloriesMin = cMin === undefined || e.calories >= cMin;
            const byCaloriesMax = cMax === undefined || e.calories <= cMax;
            const byProteinMin = pMin === undefined || e.protein >= pMin;
            const byProteinMax = pMax === undefined || e.protein <= pMax;
            const byFatMin = fMin === undefined || e.fat >= fMin;
            const byFatMax = fMax === undefined || e.fat <= fMax;
            const byCarbMin = cbMin === undefined || e.carb >= cbMin;
            const byCarbMax = cbMax === undefined || e.carb <= cbMax;

            return matchesName
                && matchesData
                && byCaloriesMin && byCaloriesMax
                && byProteinMin && byProteinMax
                && byFatMin && byFatMax
                && byCarbMin && byCarbMax;
        });
    }, [
        searchName, userDays, searchDate,
        caloriesMin, caloriesMax,
        proteinMin, proteinMax,
        fatMin, fatMax,
        carbMin, carbMax
    ]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchName, searchDate,
        caloriesMin, caloriesMax,
        proteinMin, proteinMax,
        fatMin, fatMax,
        carbMin, carbMax,
        setCurrentPage
    ]);

    const handleResetFilters = useCallback(() => {
        setSearchName('');
        setSearchDate('');
        setCaloriesMin(Number.NaN);
        setCaloriesMax(Number.NaN);
        setProteinMin(Number.NaN);
        setProteinMax(Number.NaN);
        setFatMin(Number.NaN);
        setFatMax(Number.NaN);
        setCarbMin(Number.NaN);
        setCarbMax(Number.NaN);
    }, []);


    return (
        <div className="nutrition">
            <NutritionHeader
                ref={listTopRef}
                searchName={searchName}
                onSearchNameChange={setSearchName}
                searchDate={searchDate}
                onSearchDateChange={setSearchDate}
                caloriesMin={caloriesMin}
                onCaloriesMinChange={setCaloriesMin}
                caloriesMax={caloriesMax}
                onCaloriesMaxChange={setCaloriesMax}
                proteinMin={proteinMin}
                onProteinMinChange={setProteinMin}
                proteinMax={proteinMax}
                onProteinMaxChange={setProteinMax}
                fatMin={fatMin}
                onFatMinChange={setFatMin}
                fatMax={fatMax}
                onFatMaxChange={setFatMax}
                carbMin={carbMin}
                onCarbMinChange={setCarbMin}
                carbMax={carbMax}
                onCarbMaxChange={setCarbMax}
                isFilterWindowOpen={isFilterWindowOpen}
                toggleFilterWindow={toggleFilterWindow}
                onResetFilters={handleResetFilters}
            />

            <div className="grid mt-6 grid-cols-1 gap-3">
                {filteredList.length > 0 ? (
                    paginatedList.map(item => (
                        <NutritionDayItem
                            key={item.id}
                            {...item}
                        />
                        )
                    )
                ) : (
                    <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                        Добавленных дней не найдено, попробуйте изменить фильтры и проверить подключение к сети.
                    </div>
                )}
            </div>

            {totalItems > itemsPerPage && (
                <MainPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </div>
    )
}