
export interface NutritionDay {
    id: number;
    publicId: string;
    name: string;
    date: string;
    description?: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}

export interface NutritionFormValues {
    dayName: string;
    dayDescription: string;
    calories: string;
    protein: string;
    fat: string;
    carb: string;
    dayDate: string;
}
