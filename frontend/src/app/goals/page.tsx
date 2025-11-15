import type { Metadata } from 'next';
import Goals from "@/app/goals/Goals";
import {GoalsStructure} from "@/types/goalTypes";

export const metadata: Metadata = {
    title: "Цели | TrainingPage",
    description: 'На данной странице вы можете посмотреть свои активные цели по тренировочному процессу и питанию',
}

export default function GoalsPage(){

    const clientGoalsFakeData: GoalsStructure[] = [
        {
            id: 3,
            name: 'Купить ящик пива',
            description: 'Надо пожать сотку и купить ящик пива',
            priority: 'Низкий',
        },
        {
            id: 6,
            name: 'Пожать 200 ногами',
            description: 'Надо пожать сотку и купить ящик пива цуацуцуурпцайцуацуацуацац шщпшукпукшпоукшпуохпшукопхшукпоухшпоухшпоухшпукопшукопшукпоухкшпоухкшпуохпшопхшукопхшпоухкшпоу',
            priority: 'Высокий',
        }
    ]

    return <Goals clientGoals={clientGoalsFakeData} />
}