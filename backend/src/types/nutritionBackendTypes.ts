
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
    publicId: string;
}

export interface AddDayModelRequestStructure extends AddNewDayFrontendStructure {
    user_id: number;
}

export interface DayUpgradeRequestStructure extends AddNewDayFrontendStructure {
    publicId: string;
    user_id: number;
}

export interface DayUpdateFrontendStructure extends AddNewDayFrontendStructure {
    dayId: string;
}
