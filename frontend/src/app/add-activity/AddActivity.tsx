'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {useState} from "react";

export default function AddActivity(){

    const activityName = useInputField('');
    const activityDescription = useInputField('');
    const activityType = useInputField('');
    const activityDifficulty = useInputField('');
    const trainingId = useInputField('');
    const [exercises, setExercises ] = useState([]);

    return (
        <h1>AddActivity</h1>
    )
}