import { Metadata } from "next";
import { cookies } from "next/headers";
import ChangeNutrition from "@/app/nutrition/[nutritionId]/ChangeNutrition";
import {getDayInformation} from "@/lib/controllers/nutritionController";
import ErrorState from "@/components/errors/ErrorState";

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
    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const dayInfo = await getDayInformation(tokenValue, Number(nutritionId));

    if (!dayInfo) {
        return (
            <ErrorState
                title="Не удалось загрузить информацию о дне"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <ChangeNutrition dayInfo={dayInfo} token={tokenValue} />
}