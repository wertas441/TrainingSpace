import type { Metadata } from 'next';
import MyTraining from "@/app/my-training/MyTraining";
import {cookies} from "next/headers";
import {getExercisesList} from "@/lib";
import {getTrainingList} from "@/lib/controllers/trainingController";

export const metadata: Metadata = {
    title: 'Мои тренировки | TrainingSpace',
    description: 'Страница на которой вы можете найти список созданных вами тренировок',
}

export default async function MyTrainingPage() {

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const clientTrainings = await getTrainingList(tokenValue)
    const exercises = await getExercisesList(tokenValue);

    return <MyTraining trainingList={clientTrainings} exercises={exercises} />
}