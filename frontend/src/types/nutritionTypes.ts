export interface NutritionDay {
    id: number | string;
    name: string;
    date: Date | string;
    description?: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}
