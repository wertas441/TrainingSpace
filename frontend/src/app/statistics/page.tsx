import Statistics from "@/app/statistics/Statistics";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Ваша статистика | TrainingSpace",
    description: "Страница сервиса TrainingSpace на которой вы можете посмотреть статистику вашего пользовательского аккаунта",
}

export default function StatisticsPage(){

    return <Statistics />
}

