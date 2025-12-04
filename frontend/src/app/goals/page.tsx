import type { Metadata } from 'next';
import Goals from "@/app/goals/Goals";
import {getGoalList} from "@/lib/controllers/goalController";
import {cookies} from "next/headers";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Цели | TrainingPage",
    description: 'На данной странице вы можете посмотреть свои активные цели по тренировочному процессу и питанию',
}

export default async function GoalsPage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const goalsList = await getGoalList(tokenValue);

    if (!goalsList) {
        return (
            <ErrorState
                title="Не удалось загрузить список целей"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <Goals clientGoals={goalsList} token={tokenValue} />
}