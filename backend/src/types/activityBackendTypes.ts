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
    activity_name: string;
    description: string;
    activity_type: ActivityTypeStructure;
    activity_difficult: ActivityDifficultyStructure;
    training_id: number;
    performed_at: string;
    exercises: ActivityExerciseRequest[];
}

export interface AddActivityModelRequest extends AddActivityFrontendRequest {
    user_id: number;
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

export interface ActivityUpdateFrontendStructure {
    activityId: string;
    name: string;
    description: string;
    activityDate: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    exercises: ActivityExerciseFrontend[];
}