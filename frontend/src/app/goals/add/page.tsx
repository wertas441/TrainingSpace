import {Metadata} from "next";
import AddGoal from "@/app/goals/add/AddGoal";

export const metadata: Metadata = {
    title: 'Добавить цель | TrainingSpace',
    description: 'Страница для добавление новой цели в свой список',
}

export default function AddGoalPage(){

    return <AddGoal />
}