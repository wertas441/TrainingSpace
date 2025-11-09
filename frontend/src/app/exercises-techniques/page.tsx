import type { Metadata } from 'next';
import ExercisesTechniques from "@/app/exercises-techniques/ExercisesTechniques";

export const metadata: Metadata = {
    title: "Management Techniques",
    description: "Management Techniques",
}

export default function ExercisesTechniquesPage(){

    return (
        <ExercisesTechniques />
    )
}