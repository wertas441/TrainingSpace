import type { Metadata } from 'next';
import Login from "@/app/auth/login/Login";

export const metadata: Metadata = {
    title: "Авторизация | TrainingSpace",
    description: "Страница авторизации в пользовательский аккаунт в сервисе TrainingSpace",
}

export default function LoginPage(){

    return <Login />
}