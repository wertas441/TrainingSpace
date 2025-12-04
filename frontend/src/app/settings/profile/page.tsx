import {Metadata} from "next";
import Profile from "@/app/settings/profile/Profile";
import {cookies} from "next/headers";
import {getUserData} from "@/lib/controllers/settingController";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: 'Профиль | TrainingSpace',
    description: 'Страница профиля пользователя в сервисе TrainingSpace',
}

export default async function ProfilePage(){

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const userData = await getUserData(tokenValue);

    if (!userData) {
        return (
            <ErrorState
                title="Не удалось загрузить ваши данные"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <Profile userData={userData} />
}