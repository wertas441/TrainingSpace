// Базовые типы для API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ExerciseListFrontendStructure {
    id: number;
    name: string;
    difficulty: 'light' | 'middle' | 'hard';
    description: string;
    partOfTheBody: string[];
}

export interface MainStatisticsBackendResponse {
    totalDays: number;
    totalTraining: number;
    totalGoalComplete: number;
    totalActivity: number;
}

export interface NutritionStatisticsBackendResponse {
    averageCalories: number;
    averageProtein: number;
    averageFat: number;
    averageCarb: number;
}


