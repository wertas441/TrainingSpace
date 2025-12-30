import {Metadata} from "next";
import Profile from "@/app/settings/profile/Profile";

export const metadata: Metadata = {
    title: 'Профиль | TrainingSpace',
    description: 'Страница профиля пользователя в сервисе TrainingSpace',
}

export default async function ProfilePage(){

    return <Profile />
}