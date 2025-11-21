import type { Metadata } from 'next';
import {cookies} from "next/headers";
import {getTrainingList} from "@/lib/controllers/trainingController";
import AddActivity from "@/app/add-activity/AddActivity";

export const metadata: Metadata = {
    title: "Добавить активность | TrainingSpace",
    description: "Страница добавление вашей активности в приложение TrainingSpace для последующего отслеживания ",
}

export default async function AddActivityPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const trainings = await getTrainingList(tokenValue);

    return <AddActivity myTrainings = {trainings} />
}