import {Metadata} from "next";
import {cookies} from "next/headers";
import {getTrainingInformation} from "@/lib/controllers/trainingController";
import ChangeTraining from "@/app/my-training/[trainingId]/ChangeTraining";
import {getExercisesList} from "@/lib";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
    title: "Изменение тренировки | TrainingSpace",
    description: 'Страница изменения существующей тренировки-шаблона пользователя в сервисе TrainingSpace',
}

interface ChangeTrainingPageProps {
    params: {
        trainingId: string;
    };
}

export default async function ChangeTrainingPage({params}: ChangeTrainingPageProps){

    const { trainingId } = await params;

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const trainingInfo = await getTrainingInformation(tokenValue, Number(trainingId));
    const exercises = await getExercisesList(tokenValue);

    if (!trainingInfo) {
        notFound();
    }

    return <ChangeTraining trainingInfo = {trainingInfo} token = {tokenValue} exercises = {exercises}  />
}