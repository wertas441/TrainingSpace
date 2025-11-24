import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ChangeNutrition from "@/app/nutrition/[nutritionId]/ChangeNutrition";
import {getDayInformation} from "@/lib/controllers/nutritionController";

export const metadata: Metadata = {
    title: "Изменение дня | TrainingSpace",
    description: 'Страница изменения существующего дня в системе питания пользователя в сервисе TrainingSpace',
}

interface ChangeNutritionPageProps {
    params: {
        nutritionId: string;
    };
}

export default async function ChangeNutritionPage({ params }: ChangeNutritionPageProps){

    const { nutritionId } = await params;

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const dayInfo = await getDayInformation(tokenValue, Number(nutritionId));

    if (!dayInfo) {
        notFound();
    }

    return <ChangeNutrition dayInfo={dayInfo} token={tokenValue} />
}