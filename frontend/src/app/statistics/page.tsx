import Statistics from "@/app/statistics/Statistics";
import {Metadata} from "next";
import {cookies} from "next/headers";
import {
    getMainStatisticsCardInfo,
    getNutritionGraphicInfo,
    getNutritionStatisticsCardInfo
} from "@/lib/controllers/statistic";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Ваша статистика | TrainingSpace",
    description: "Страница сервиса TrainingSpace на которой вы можете посмотреть статистику вашего пользовательского аккаунта",
}

export default async function StatisticsPage() {

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const mainCardData = await getMainStatisticsCardInfo(tokenValue);
    const nutritionCardData = await getNutritionStatisticsCardInfo(tokenValue);
    const nutritionGraphicData = await getNutritionGraphicInfo(tokenValue);

    if (!mainCardData || !nutritionGraphicData || !nutritionCardData) {
        return (
            <ErrorState
                title="Не удалось загрузить данные для статистики"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return (
        <Statistics
            mainCardData={mainCardData}
            nutritionCardData={nutritionCardData}
            nutritionGraphicData={nutritionGraphicData}
        />
    );
}

