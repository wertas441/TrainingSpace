import {Metadata} from "next";
import CompletedGoals from "@/app/goals/completed/CompletedGoals";
import {cookies} from "next/headers";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: 'Выполненные цели | TrainingSpace',
    description: 'Страница истории выполненных пользовательских целей в сервисе TrainingSpace',
}

export default async function CompletedGoalsPage() {

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    return <CompletedGoals token={tokenValue} />
}