import Statistics from "@/app/statistics/Statistics";
import {Metadata} from "next";
import {cookies} from "next/headers";
import {getMainStatisticsCardInfo, getNutritionStatisticsCardInfo} from "@/lib/controllers/statisticsController";

export const metadata: Metadata = {
    title: "Ваша статистика | TrainingSpace",
    description: "Страница сервиса TrainingSpace на которой вы можете посмотреть статистику вашего пользовательского аккаунта",
}

export default async function StatisticsPage() {

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const mainCardData = await getMainStatisticsCardInfo(tokenValue);
    const nutritionCardData = await getNutritionStatisticsCardInfo(tokenValue);

    return <Statistics mainCardData={mainCardData} nutritionCardData={nutritionCardData} />
}

