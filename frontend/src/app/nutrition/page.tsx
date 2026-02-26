import Nutrition from "@/app/nutrition/Nutrition";
import {Metadata} from "next";
import {cookies} from "next/headers";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Питание | TrainingSpace",
    description: 'Страница на которой вы можете отслеживать свое питание и потребление калорий'
}

export default async function NutritionPage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    return <Nutrition token={tokenValue} />
}