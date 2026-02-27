import type { Metadata } from 'next';
import {cookies} from "next/headers";
import AddActivity from "@/app/add-activity/AddActivity";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Добавить активность | TrainingSpace",
    description: "Страница добавление вашей активности в приложение TrainingSpace для последующего отслеживания ",
}

export default async function AddActivityPage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    return <AddActivity token={tokenValue} />
}