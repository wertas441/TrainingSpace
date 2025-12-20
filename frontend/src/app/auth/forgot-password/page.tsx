import {Metadata} from "next";
import ForgotPassword from "@/app/auth/forgot-password/ForgotPassword";

export const metadata: Metadata = {
    title: 'Восстановление пароля | TrainingSpace',
    description: 'Форма восстановления доступа к аккаунту TrainingSpace',
}

export default function ForgotPasswordPage(){

    return <ForgotPassword />
}