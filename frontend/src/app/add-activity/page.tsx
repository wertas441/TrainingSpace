import type { Metadata } from 'next';
import {cookies} from "next/headers";
import {getTrainingList} from "@/lib/controllers/trainingController";
import AddActivity from "@/app/add-activity/AddActivity";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Добавить активность | TrainingSpace",
    description: "Страница добавление вашей активности в приложение TrainingSpace для последующего отслеживания ",
}

export default async function AddActivityPage(){

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

    const tokenValue = authTokenCookie.value;
    const trainings = await getTrainingList(tokenValue);

    if (!trainings) {
        return (
            <ErrorState
                title="Не удалось загрузить страницу добавления активности"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <AddActivity myTrainings = {trainings} />
}