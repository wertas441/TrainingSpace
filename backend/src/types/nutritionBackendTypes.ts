
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

export interface DayUpgradeRequestStructure extends AddNewDayFrontendStructure {
    id: number;
    user_id: number;
}


export interface AddDayModelRequestStructure extends AddNewDayFrontendStructure {
    user_id: number;
}
