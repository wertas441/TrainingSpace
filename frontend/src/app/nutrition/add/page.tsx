import {Metadata} from "next";
import AddNutrition from "@/app/nutrition/add/AddNutrition";

export const metadata: Metadata = {
    title: "Добавить в питание | TrainingSpace",
    description: "Страница для добавления нового дня в отслеживание питания",
}

export default function AddNutritionPage(){

    return (
        <AddNutrition />
    )
}