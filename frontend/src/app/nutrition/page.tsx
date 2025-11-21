import Nutrition from "@/app/nutrition/Nutrition";
import {Metadata} from "next";
import {cookies} from "next/headers";
import {getDayList} from "@/lib/controllers/nutritionController";

export const metadata: Metadata = {
    title: "Питание | TrainingSpace",
    description: 'Страница на которой вы можете отслеживать свое питание и потребление калорий'
}

export default async function NutritionPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const daysList = await getDayList(tokenValue);

    return <Nutrition userDays = {daysList} />
}