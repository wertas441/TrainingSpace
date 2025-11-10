'use client'

import NutritionHeader from "@/components/UI/headers/NutritionHeader";
import {NutritionDay} from "@/types/nutritionTypes";
import NutritionDayItem from "@/components/elements/NutritionDayItem";
import {useCallback, useEffect, useMemo, useState} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/MainPagination";

export default function Nutrition() {

    const testData: NutritionDay[] = [
        {
            id: 1,
            date: '27.02.2025',
            name: 'Крутой день',
            calories: 2320,
            protein: 135,
            fat: 70,
            carb: 260,
        },
        {
            id: 2,
            date: '27.04.2025',
            name: 'Забыл записать день',
            description: 'Обычный день: 10к шагов и тренировка на верх тела.',
            calories: 2850,
            protein: 160,
            fat: 85,
            carb: 310,
        },
    ];

    const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false);
    const [searchName, setSearchName] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');
    const itemsPerPage:number = 10;

    const toggleFilterWindow = useCallback(() => {
        setIsFilterWindowOpen(!isFilterWindowOpen);
    }, [isFilterWindowOpen]);

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        return testData.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesData = searchDate === '' || e.date === searchDate;
            return matchesName && matchesData;
        });
    }, [searchName, testData, searchDate]);

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
    }, [searchName, searchDate, setCurrentPage]);


    return (
        <div className="nutrition">
            <NutritionHeader
                ref={listTopRef}
                searchName={searchName}
                onSearchNameChange={setSearchName}
                searchDate={searchDate}
                onSearchDateChange={setSearchDate}
                isFilterWindowOpen={isFilterWindowOpen}
                toggleFilterWindow={toggleFilterWindow}
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
                        Ничего не найдено. Попробуйте изменить запрос.
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