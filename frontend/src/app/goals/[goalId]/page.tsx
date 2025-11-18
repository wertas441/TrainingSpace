import {Metadata} from "next";
import ChangeGoal from "@/app/goals/[goalId]/ChangeGoal";

export const metadata: Metadata = {
    title: "Goal",
    description: 'Goal',
}

export default function ChangeGoalPage(){

    return <ChangeGoal />
}