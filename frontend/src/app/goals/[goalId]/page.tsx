import { Metadata } from "next";
import {ChangeGoal} from "@/app/goals/[goalId]/ChangeGoal";
import { cookies } from "next/headers";
import { getGoalInformation } from "@/lib/controllers/goalController";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Изменение цели | TrainingSpace",
    description: 'Страница изменения существующей цели пользователя в сервисе TrainingSpace',
}

interface ChangeGoalPageProps {
    params: Promise<{
        goalId: string;
    }>
}

export default async function ChangeGoalPage({ params }: ChangeGoalPageProps){

    const { goalId } = await params;

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const goalInfo = await getGoalInformation(tokenValue, goalId);

    if (!goalInfo) {
        return (
            <ErrorState
                title="Не удалось загрузить информацию о цели"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <ChangeGoal goalInfo={goalInfo} token={tokenValue} />
}