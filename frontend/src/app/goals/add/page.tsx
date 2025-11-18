import {Metadata} from "next";
import AddGoal from "@/app/goals/add/AddGoal";
import {GoalPriority} from "@/types/goalTypes";

export const metadata: Metadata = {
    title: 'Добавить цель | TrainingSpace',
    description: 'Страница для добавление новой цели в свой список',
}

export default function AddGoalPage(){

    const goalPriorityOptions: GoalPriority[] = ['Низкий', 'Средний', 'Высокий'];

    return <AddGoal goalPriorityOptions={goalPriorityOptions} />
}