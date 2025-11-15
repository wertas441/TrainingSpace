
export interface AddNewDayFrontendStructure {
    name: string;
    description: string;
    date: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}

export interface DayListFrontendStructure extends AddNewDayFrontendStructure {
    id: number;
}