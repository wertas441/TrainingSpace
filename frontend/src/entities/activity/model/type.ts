export type ActivityTypeStructure = 'Силовая' | 'Кардио' | 'Комбинированный';

export type ActivityDifficultyStructure = 'Лёгкая' | 'Средняя' | 'Тяжелая';

export type ActivityDifficultyFilter= ActivityDifficultyStructure | null ;

export type ActivityTypeFilter = ActivityTypeStructure | null;

export interface ActivityForm {
    name: string;
    description: string;
    date: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: string;
}

export interface ActivityDataStructure {
    id: number;
    publicId: string;
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

interface ExerciseSetsStructure {
    id: number;
    weight: number;
    quantity: number;
}

export type ExerciseSetsByExerciseId = Record<number, ExerciseSetsStructure[]>;