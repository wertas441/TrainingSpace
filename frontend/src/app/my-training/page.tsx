import type { Metadata } from 'next';
import MyTraining from "@/app/my-training/MyTraining";
import {testTrainingData} from "@/lib/data/training";

export const metadata: Metadata = {
    title: 'Мои тренировки | TrainingSpace',
    description: 'Страница на которой вы можете найти список созданных вами тренировок',
}

export default function MyTrainingPage() {

    return <MyTraining trainingList={testTrainingData} />
}