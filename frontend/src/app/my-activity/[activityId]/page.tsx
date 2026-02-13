import { Metadata } from "next";
import { cookies } from "next/headers";
import ChangeActivity from "@/app/my-activity/[activityId]/ChangeActivity";
import {getActivityInformation} from "@/lib/controllers/activity";
import {getTrainingList} from "@/lib/controllers/training";
import ErrorState from "@/components/errors/ErrorState";

export const metadata: Metadata = {
    title: "Изменение активности | TrainingSpace",
    description: 'Страница изменения существующей активности в сервисе TrainingSpace',
}

interface ChangeActivityProps {
    params: Promise<{
        activityId: string;
    }>
}

export default async function ChangeActivityPage({ params }: ChangeActivityProps){

    const { activityId } = await params;

    const tokenValue = (await cookies()).get('token')?.value;

    if (!tokenValue) {
        return (
            <ErrorState
                title="Проблема с авторизацией"
                description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
            />
        );
    }

    const activityInfo = await getActivityInformation(tokenValue, activityId);
    const trainings = await getTrainingList(tokenValue);

    if (!activityInfo || !trainings) {
        return (
            <ErrorState
                title="Не удалось загрузить информацию об активности"
                description="Проверьте подключение к интернету или попробуйте обновить страницу чуть позже."
            />
        );
    }

    return <ChangeActivity activityInfo={activityInfo} myTrainings={trainings} token={tokenValue} />
}