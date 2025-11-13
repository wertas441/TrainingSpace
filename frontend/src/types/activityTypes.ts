
export type ActivityTypeStructure = 'Силовая' | 'Кардио' | 'Комбинированный';

export type ActivityDifficultyStructure = 'Лёгкая' | 'Средняя' | 'Тяжелая';

export interface ActivityDataStructure {
    id: number;
    name: string;
    description: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    exercises: {
        id: number;
        try: {
            id: number;
            weight: number;
            quantity: number;
        }[];
    }[];
}