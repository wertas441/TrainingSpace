import {Metadata} from "next";
import CompletedGoals from "@/app/goals/completed/CompletedGoals";
import {cookies} from "next/headers";
import ErrorState from "@/components/errors/ErrorState";
import {getCompleteGoalList} from "@/lib/controllers/goalController";

export const metadata: Metadata = {
    title: 'Выполненные цели | TrainingSpace',
    description: 'Страница истории выполненных пользовательских целей в сервисе TrainingSpace',
}

export default async function CompletedGoalsPage() {

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');

    if (!authTokenCookie) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const tokenValue:string = authTokenCookie.value;
    const completeList = await getCompleteGoalList(tokenValue);

    if (!completeList) {
        return (
            <ErrorState
                title="Не удалось загрузить список выполненных целей"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <CompletedGoals completeList={completeList} />
}