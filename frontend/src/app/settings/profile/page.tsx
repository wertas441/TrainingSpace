import {Metadata} from "next";
import Profile from "@/app/settings/profile/Profile";
import {cookies} from "next/headers";
import {getUserData} from "@/lib/controllers/settingController";

export const metadata: Metadata = {
    title: 'Профиль | TrainingSpace',
    description: 'Страница профиля пользователя в сервисе TrainingSpace',
}

export default async function ProfilePage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const userData = await getUserData(tokenValue);

    return <Profile userData={userData} />
}