import {Metadata} from "next";
import Settings from "@/app/settings/Settings";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: 'Настройки | TrainingSpace',
    description: 'Страница для получения и изменения информации об аккаунте',
}

export default async function SettingsPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    return <Settings token = {tokenValue} />
}