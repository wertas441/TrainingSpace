import AddNewTraining from "@/app/my-training/add/AddNewTraining";
import {Metadata} from "next";
import {cookies} from "next/headers";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: 'Добавить новую тренировку | TrainingSpace',
    description: 'Страница добавление новой тренировки-шаблона в сервис TrainingSpace',
}

export default async function AddNewTrainingPage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    return <AddNewTraining />
}