import type { Metadata } from 'next';
import ExercisesTechniques from "@/app/exercises-techniques/ExercisesTechniques";
import {getExercisesList} from "@/lib";
import {cookies} from "next/headers";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Техника выполнения упражнений | TrainingSpace",
    description: "На данной страницы вы можете посмотреть как правильно выполнять упражнения представленный в сервисе TrainingSpace",
}

export default async function ExercisesTechniquesPage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const exercises = await getExercisesList(tokenValue);

    if (!exercises) {
        return (
            <ErrorState
                title="Не удалось загрузить список упражнений"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <ExercisesTechniques exercises = {exercises} />
}