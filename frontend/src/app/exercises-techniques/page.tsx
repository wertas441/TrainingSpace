import type { Metadata } from 'next';
import ExercisesTechniques from "@/app/exercises-techniques/ExercisesTechniques";
import {getExercisesList} from "@/lib";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: "Техника выполнения упражнений | TrainingSpace",
    description: "На данной страницы вы можете посмотреть как правильно выполнять упражнения представленный в сервисе TrainingSpace",
}

export default async function ExercisesTechniquesPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const exercises = await getExercisesList(tokenValue);

    return <ExercisesTechniques exercises = {exercises} />
}