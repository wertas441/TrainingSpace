import {Metadata} from "next";
import {cookies} from "next/headers";
import {getTrainingInformation} from "@/lib/controllers/training";
import ChangeTraining from "@/app/my-training/[trainingId]/ChangeTraining";
import ErrorState from "@/components/errors/ErrorState";
import {getExercisesList} from "@/lib";

export const metadata: Metadata = {
    title: "Изменение тренировки | TrainingSpace",
    description: 'Страница изменения существующей тренировки-шаблона пользователя в сервисе TrainingSpace',
}

interface ChangeTrainingPageProps {
    params: Promise<{
        trainingId: string;
    }>
}

export default async function ChangeTrainingPage({params}: ChangeTrainingPageProps){

    const { trainingId } = await params;
    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const trainingInfo = await getTrainingInformation(tokenValue, trainingId);
    const exercises = await getExercisesList(tokenValue);

    if (!trainingInfo || !exercises) {
        return (
            <ErrorState
                title="Не удалось загрузить информацию о тренировке"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <ChangeTraining trainingInfo = {trainingInfo} token = {tokenValue} exercises = {exercises}  />
}