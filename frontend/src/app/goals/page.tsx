import type { Metadata } from 'next';
import Goals from "@/app/goals/Goals";
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

    return <Goals token={tokenValue} />
}