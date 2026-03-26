
export interface MainStatisticsCardResponse {
    totalDays: number;
    totalTraining: number;
    totalGoalComplete: number;
    totalActivity: number;
}

export interface NutritionStatisticsCardResponse {
    averageCalories: number;
    averageProtein: number;
    averageFat: number;
    averageCarb: number;
}

export interface NutritionStatisticsGraphicResponse {
    date: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}

export type NutritionMetric = 'calories' | 'protein' | 'fat' | 'carb';

export interface MetricOptionStructure {
    id: NutritionMetric;
    label: string;
}