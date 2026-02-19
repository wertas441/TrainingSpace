
export interface NutritionDay {
    id: number;
    publicId: string;
    name: string;
    date: string;
    description?: string;
    calories: string;
    protein: string;
    fat: string;
    carb: string;
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
