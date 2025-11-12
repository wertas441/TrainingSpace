import {Metadata} from "next";
import Settings from "@/app/settings/Settings";

export const metadata: Metadata = {
    title: 'Настройки | TrainingSpace',
    description: 'Страница для получения и изменения информации об аккаунте',
}

export default function SettingsPage(){

    return <Settings />
}