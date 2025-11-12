import type { Metadata } from 'next';
import MyTraining from "@/app/my-training/MyTraining";
import {TrainingDataStructure} from "@/types/indexTypes";

export const metadata: Metadata = {
    title: 'Мои тренировки | TrainingSpace',
    description: 'Страница на которой вы можете найти список созданных вами тренировок',
}

export default function MyTrainingPage() {

    /// Имитация запроса на сервер, чтобы получить список тренировок пользователя
    const testTrainingData: TrainingDataStructure[] = [
        {
            id: 1,
            name: 'Обычная тренировка рук',
            description: 'Моя повседневная тренирвока рук стоит выполнять ее только когда совсем нечего делать',
            exercises: [0, 1, 5, 7, 11]
        },
    ]

    return <MyTraining trainingList={testTrainingData} />
}