'use client'

import NutritionHeader from "@/components/UI/headers/NutritionHeader";
import {NutritionDay} from "@/types/nutritionTypes";
import NutritionDayItem from "@/components/elements/NutritionDayItem";
import {useNameDateFilter} from "@/lib/hooks/useNameDateFilter";

export default function Nutrition() {

    const testData: NutritionDay[] = [
        {
            id: 1,
            date: new Date(),
            name: 'Вторник',
            calories: 2320,
            protein: 135,
            fat: 70,
            carb: 260,
        },
        {
            id: 2,
            date: new Date(),
            name: 'Среда',
            description: 'Обычный день: 10к шагов и тренировка на верх тела.',
            calories: 2850,
            protein: 160,
            fat: 85,
            carb: 310,
        },
    ];

    const {searchName, setSearchName, searchDate, setSearchDate, filteredItems} =
        useNameDateFilter<NutritionDay>(testData, (i) => i.name, (i) => i.date);

    return (
        <div className="nutrition">
            <NutritionHeader
                searchName={searchName}
                onSearchNameChange={setSearchName}
                searchDate={searchDate}
                onSearchDateChange={setSearchDate}
            />
            
            <div className="mt-8 space-y-5">
                {filteredItems.map(item => (
                    <NutritionDayItem key={item.id} {...item} />
                ))}
            </div>
        </div>
    )
}