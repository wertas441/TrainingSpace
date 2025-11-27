import type { Metadata } from 'next';
import Goals from "@/app/goals/Goals";
import {getGoalList} from "@/lib/controllers/goalController";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: "Цели | TrainingPage",
    description: 'На данной странице вы можете посмотреть свои активные цели по тренировочному процессу и питанию',
}

export default async function GoalsPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const goalsList = await getGoalList(tokenValue);

    return <Goals clientGoals={goalsList} token={tokenValue} />
}