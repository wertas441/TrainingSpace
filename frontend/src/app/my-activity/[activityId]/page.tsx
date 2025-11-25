import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ChangeActivity from "@/app/my-activity/[activityId]/ChangeActivity";
import {getActivityInformation} from "@/lib/controllers/activityController";
import {getTrainingList} from "@/lib/controllers/trainingController";

export const metadata: Metadata = {
    title: "Изменение активности | TrainingSpace",
    description: 'Страница изменения существующей активности в сервисе TrainingSpace',
}

interface ChangeActivityProps {
    params: {
        activityId: string;
    };
}

export default async function ChangeActivityPage({ params }: ChangeActivityProps){

    const { activityId } = await params;

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const activityInfo = await getActivityInformation(tokenValue, Number(activityId));
    const trainings = await getTrainingList(tokenValue);

    if (!activityInfo) {
        notFound();
    }

    return <ChangeActivity activityInfo={activityInfo} myTrainings={trainings} token={tokenValue} />
}