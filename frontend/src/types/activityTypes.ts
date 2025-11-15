
export type ActivityTypeStructure = 'Силовая' | 'Кардио' | 'Комбинированный';

export type ActivityDifficultyStructure = 'Лёгкая' | 'Средняя' | 'Тяжелая';

export interface ActivityDataStructure {
    id: number;
    name: string;
    description: string;
    activityDate: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    exercises: {
        exercisesId: number;
        try: {
            id: number;
            weight: number;
            quantity: number;
        }[];
    }[];
}