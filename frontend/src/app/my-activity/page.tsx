import type { Metadata } from 'next';
import MyActivity from "@/app/my-activity/MyActivity";
import {cookies} from "next/headers";
import {getActivityList} from "@/lib/controllers/activityController";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: 'Моя активность | TrainingSpace',
    description: 'На этой странице вы можете отследить вашу добавленную в сервис активность',
}

export default async function MyActivityPage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const clientActivity = await getActivityList(tokenValue)

    if (!clientActivity) {
        return (
            <ErrorState
                title="Не удалось загрузить список активности"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <MyActivity clientActivity = {clientActivity} />
}