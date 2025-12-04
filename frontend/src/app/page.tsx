import Dashboard from "@/app/Dashboard";
import {Metadata} from "next";
import {cookies} from "next/headers";
import {getGoalShortyList} from "@/lib/controllers/goalController";
import {getNutritionGraphicInfo} from "@/lib/controllers/statisticsController";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Главная | TrainingSpace",
    description: 'Главная страница сервиса TrainingSpace',
}

export default async function Home() {

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const goalsShortyList = await getGoalShortyList(tokenValue);
    const nutritionGraphicData = await getNutritionGraphicInfo(tokenValue);

    if (!nutritionGraphicData || !goalsShortyList) {
        return (
            <ErrorState
                title="Не удалось загрузить главную страницу"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <Dashboard goalsShortyList={goalsShortyList}  nutritionGraphicData={nutritionGraphicData} />
}
