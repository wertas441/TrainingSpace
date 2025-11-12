import {Metadata} from "next";
import Registration from "@/app/auth/registration/Registration";

export const metadata: Metadata = {
    title: "Регистрация | TrainingSpace",
    description: "Страница регистрации нового пользовательского аккаунта в сервисе TrainingSpace",
}

export default function RegistrationPage() {

    return <Registration />
}