import Nutrition from "@/app/nutrition/Nutrition";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Питание | TrainingSpace",
    description: 'Страница на которой вы можете отслеживать свое питание и потребление калорий'
}

export default function NutritionPage(){

    return (
        <Nutrition />
    )
}