import type { Metadata } from 'next';
import ExercisesTechniques from "@/app/exercises-techniques/ExercisesTechniques";

export const metadata: Metadata = {
    title: "Техника выполнения упражнений | TrainingSpace",
    description: "На данной страницы вы можете посмотреть как правильно выполнять упражнения представленный в сервисе TrainingSpace",
}

export default function ExercisesTechniquesPage(){

    return (
        <ExercisesTechniques />
    )
}