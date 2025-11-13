import type { Metadata } from 'next';
import AddActivity from "@/app/add-activity/AddActivity";
import {testTrainingData} from "@/lib/data/training";
import {ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activityTypes";

export const metadata: Metadata = {
    title: "Добавить активность | TrainingSpace",
    description: "Страница добавление вашей активности в приложение TrainingSpace для последующего отслеживания ",
}

export default function AddActivityPage(){

    const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'];
    const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'];


    return <AddActivity
        myTrainings = {testTrainingData}
        activityTypeChoices = {activityTypeChoices}
        activityDifficultyChoices = {activityDifficultyChoices}
    />
}