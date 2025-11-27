

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

export interface NutritionGraphicBackendResponse {
    date: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}