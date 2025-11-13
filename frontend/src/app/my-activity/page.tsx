import type { Metadata } from 'next';
import MyActivity from "@/app/my-activity/MyActivity";
import {ActivityDataStructure} from "@/types/activityTypes";

export const metadata: Metadata = {
    title: 'Моя активность | TrainingSpace',
    description: 'На этой странице вы можете отследить вашу добавленную в сервис активность',
}

export default function MyActivityPage(){

    const activityData: ActivityDataStructure[] = [
        {
            id: 1,
            name: 'Грудь + трицепс',
            description: 'Тренировка с упором на грудные мышцы и трицепс',
            type: 'Силовая',
            difficulty: 'Средняя',
            trainingId: 3,
            exercises: [
                {
                    id: 2,
                    try: [
                        { id: 1, weight: 60, quantity: 12 },
                        { id: 2, weight: 70, quantity: 10 },
                        { id: 3, weight: 70, quantity: 8 },
                    ],
                },
                {
                    id: 3,
                    try: [
                        { id: 1, weight: 40, quantity: 12 },
                        { id: 2, weight: 24, quantity: 12 },
                        { id: 3, weight: 40, quantity: 10 },
                    ],
                },
            ],
        },
        {
            id: 2,
            name: 'Ноги',
            description: 'Присед и жим ногами',
            type: 'Силовая',
            difficulty: 'Тяжелая',
            trainingId: 5,
            exercises: [
                {
                    id: 6,
                    try: [
                        { id: 1, weight: 80, quantity: 10 },
                        { id: 2, weight: 90, quantity: 8 },
                        { id: 3, weight: 90, quantity: 6 },
                    ],
                },
                {
                    id: 7,
                    try: [
                        { id: 1, weight: 140, quantity: 12 },
                        { id: 2, weight: 160, quantity: 10 },
                    ],
                },
            ],
        }
    ]

    return <MyActivity activityData = {activityData} />
}