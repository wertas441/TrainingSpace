import AddNewTraining from "@/app/my-training/add/AddNewTraining";
import {Metadata} from "next";
import {cookies} from "next/headers";
import {getExercisesList} from "@/lib";

export const metadata: Metadata = {
    title: 'Добавить новую тренировку | TrainingSpace',
    description: 'Страница добавление новой тренировки-шаблона в сервис TrainingSpace',
}

export default async function AddNewTrainingPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const exercises = await getExercisesList(tokenValue);

    return <AddNewTraining exercises = {exercises} />
}