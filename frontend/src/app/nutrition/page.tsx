import Nutrition from "@/app/nutrition/Nutrition";
import {Metadata} from "next";
import {NutritionDay} from "@/types/nutritionTypes";

export const metadata: Metadata = {
    title: "Питание | TrainingSpace",
    description: 'Страница на которой вы можете отслеживать свое питание и потребление калорий'
}

export default function NutritionPage(){

    const testData: NutritionDay[] = [
        {
            id: 1,
            name: 'Крутой день',
            date: '27.02.2025',
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

    return <Nutrition userDays = {testData} />
}