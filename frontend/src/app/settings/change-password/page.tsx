import {Metadata} from "next";
import ChangePassword from "@/app/settings/change-password/ChangePassword";

export const metadata: Metadata = {
    title: 'Сменить пароль | TrainingSpace',
    description: 'Страница смены пароля для пользовательского аккаунта в сервисе TrainingSpace',
}

export default function ChangePasswordPage(){

    return <ChangePassword />
}