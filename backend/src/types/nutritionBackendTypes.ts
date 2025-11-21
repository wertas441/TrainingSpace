
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

export interface AddDayModelRequestStructure {
    user_id: number;
    name: string;
    description: string;
    day_date: string;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
}
