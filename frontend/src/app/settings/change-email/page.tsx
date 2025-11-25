import {Metadata} from "next";
import ChangeEmail from "@/app/settings/change-email/ChangeEmail";

export const metadata: Metadata = {
    title: 'Сменить почту | TrainingSpace',
    description: 'Страница смены почту для пользовательского аккаунта в сервисе TrainingSpace',
}

export default function ChangeEmailPage(){

    return <ChangeEmail />
}