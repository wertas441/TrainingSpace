import { Metadata } from "next";
import ChangeGoal from "@/app/goals/[goalId]/ChangeGoal";
import { cookies } from "next/headers";
import { getGoalInformation } from "@/lib/controllers/goalController";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Изменение цели | TrainingSpace",
    description: 'Страница изменения существующей цели пользователя в сервисе TrainingSpace',
}

interface ChangeGoalPageProps {
    params: {
        goalId: string;
    };
}

export default async function ChangeGoalPage({ params }: ChangeGoalPageProps){

    const { goalId } = await params;

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const goalInfo = await getGoalInformation(tokenValue, Number(goalId));

    if (!goalInfo) {
        notFound();
    }

    return <ChangeGoal goalInfo={goalInfo} token={tokenValue} />
}