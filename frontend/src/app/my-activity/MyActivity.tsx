'use client'

import {ActivityDataStructure} from "@/types/activityTypes";

export default function MyActivity({ activityData = [] }: {activityData?: ActivityDataStructure[]; }) {

    return (
        <>
            <h1>MyActivity</h1>
            <div>
                {activityData.map((activity) => (
                    <div key={activity.id}>
                        <h2>{activity.name}</h2>
                        <p>{activity.description}</p>
                        <p>Тип: {activity.type} · Сложность: {activity.difficulty}</p>
                        <div>
                            {activity.exercises.map((ex) => (
                                <div key={ex.id}>
                                    <strong>Упражнение #{ex.id}</strong>
                                    <ul>
                                        {ex.try.map((set) => (
                                            <li key={set.id}>
                                                Подход {set.id}: {set.quantity} повт · {set.weight} кг
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}