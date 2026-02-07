import type { Metadata } from 'next';
import MyTraining from "@/app/my-training/MyTraining";
import {cookies} from "next/headers";
import {getExercisesList} from "@/lib";
import {getTrainingList} from "@/lib/controllers/training";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: 'Мои тренировки | TrainingSpace',
    description: 'Страница на которой вы можете найти список созданных вами тренировок',
}

export default async function MyTrainingPage() {

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const clientTrainings = await getTrainingList(tokenValue)
    const exercises = await getExercisesList(tokenValue);

    if (!clientTrainings || !exercises) {
        return (
            <ErrorState
                title="Не удалось загрузить список тренировок"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <MyTraining trainingList={clientTrainings} exercises={exercises} />
}