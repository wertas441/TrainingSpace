export type ActivityTypeStructure = 'Силовая' | 'Кардио' | 'Комбинированный';

export type ActivityDifficultyStructure = 'Лёгкая' | 'Средняя' | 'Тяжелая';

// Один подход по упражнению в активности
export interface ActivitySet {
    id: number;
    weight: number;
    quantity: number;
}

// Описание одного упражнения в активности (frontend → backend)
export interface ActivityExerciseRequest {
    id: number;
    try: ActivitySet[];
}

// Тело запроса от фронта при создании активности
export interface AddActivityFrontendRequest {
    activityName: string;
    description: string;
    activityType: ActivityTypeStructure;
    activityDifficult: ActivityDifficultyStructure;
    trainingId: number;
    performedAt: string;
    exercises: ActivityExerciseRequest[];
}

export interface UpdateActivityFrontendRequest {
    publicId: string;
    name: string;
    description: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    activityDate: string;
    exercises: ActivityExerciseRequest[];
}


export interface ActivityExerciseFrontend {
    exercisesId: number;
    try: ActivitySet[];
}

export interface ActivityListFrontendStructure {
    id: number;
    publicId: string;
    name: string;
    description: string;
    activityDate: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    exercises: ActivityExerciseFrontend[];
}
