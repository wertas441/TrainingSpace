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
        {
            id: 2,
            name: 'Push — грудь и плечи',
            description: 'Базовые жимы и разведения, акцент на верх тела',
            exercises: [1, 2, 3, 10, 29] // по id из справочника
        },
        {
            id: 3,
            name: 'Pull — спина и бицепс',
            description: 'Тяговые упражнения со штангой и блоками, плюс бицепс',
            exercises: [4, 5, 6, 12, 28] // по id из справочника
        },
        {
            id: 4,
            name: 'Ноги — силы и объём',
            description: 'Тяжёлая сессия ног с базовыми движениями',
            exercises: [7, 8, 9, 27, 30] // по id из справочника
        },
        {
            id: 5,
            name: 'Кардио 40 минут',
            description: 'Интервалы и равномерка, умеренная интенсивность',
            exercises: [13, 14, 15, 16, 17] // по id из справочника
        },
        {
            id: 6,
            name: 'Кор и стабилизация',
            description: 'Фокус на пресс и стабилизаторы',
            exercises: [23, 24, 25, 26] // по id из справочника
        },
        {
            id: 7,
            name: 'Быстрая домашняя',
            description: 'Минимум оборудования, 25–30 минут',
            exercises: [29, 23, 25] // по id из справочника
        },
        {
            id: 8,
            name: 'Смешанная тренировка',
            description: 'Комбо разных движений, выбранных по индексам',
            exercises: [0, 3, 11, 19] // индексы массива (0-based)
        },
    ]

    return <MyTraining trainingList={testTrainingData} />
}