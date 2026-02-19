'use client'

import NutritionHeader from "@/components/UI/headers/NutritionHeader";
import {NutritionDay} from "@/types/nutrition";
import NutritionDayItem from "@/components/elements/NutritionDayRow";
import {memo, useEffect, useMemo} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/other/MainPagination";
import NullElementsError from "@/components/errors/NullElementsError";
import {normalizeToYMD} from "@/lib";
import {NutritionFiltersProvider, useNutritionFilters} from "@/app/nutrition/NutritionFiltersContext";

function NutritionContent({userDays}: {userDays: NutritionDay[]}) {

    const { filters } = useNutritionFilters();

    const {
        searchName,
        searchDate,
        caloriesMin,
        caloriesMax,
        proteinMin,
        proteinMax,
        fatMin,
        fatMax,
        carbMin,
        carbMax
    } = filters;

    const itemsPerPage:number = 10;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return userDays.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesData = searchDate === '' || normalizeToYMD(e.date) === searchDate;
            const byCaloriesMin = caloriesMin === '' || e.calories >= caloriesMin;
            const byCaloriesMax = caloriesMax === '' || e.calories <= caloriesMax;
            const byProteinMin = proteinMin === '' || e.protein >= proteinMin;
            const byProteinMax = proteinMax === '' || e.protein <= proteinMax;
            const byFatMin = fatMin === '' || e.fat >= fatMin;
            const byFatMax = fatMax === '' || e.fat <= fatMax;
            const byCarbMin = carbMin === '' || e.carb >= carbMin;
            const byCarbMax = carbMax === '' || e.carb <= carbMax;

            return matchesName && matchesData && byCaloriesMin && byCaloriesMax && byProteinMin && byProteinMax
                && byFatMin && byFatMax && byCarbMin && byCarbMax;
        });
    }, [searchName, userDays, searchDate, caloriesMin, caloriesMax, proteinMin, proteinMax, fatMin, fatMax, carbMin, carbMax]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => {setCurrentPage(1);}, [
        searchName, searchDate,
        caloriesMin, caloriesMax,
        proteinMin, proteinMax,
        fatMin, fatMax,
        carbMin, carbMax,
        setCurrentPage
    ]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <NutritionHeader />
            <div className="grid mt-6 grid-cols-1 gap-3">
                {filteredList.length > 0 ? (
                    paginatedList.map(item => (
                        <NutritionDayItem
                            key={item.publicId}
                            id={item.id}
                            publicId={item.publicId}
                            name={item.name}
                            date={item.date}
                            description={item.description}
                            calories={item.calories}
                            protein={item.protein}
                            fat={item.fat}
                            carb={item.carb}
                        />
                        )
                    )
                ) : (
                    <NullElementsError text={
                        userDays.length === 0
                            ? "У вас пока нет добавленных дней. Нажмите «Добавить день», чтобы добавить первый."
                            : "По заданным параметрам поиска дни не найдены. Попробуйте изменить фильтр."
                    } />
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

function Nutrition({userDays}: {userDays: NutritionDay[]}) {

    return (
        <NutritionFiltersProvider>
            <NutritionContent userDays={userDays} />
        </NutritionFiltersProvider>
    );
}

export default memo(Nutrition);