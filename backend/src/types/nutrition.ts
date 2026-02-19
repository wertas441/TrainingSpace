
export interface AddNewDayFrontendStructure {
    name: string;
    description: string;
    date: string;
    calories: string;
    protein: string;
    fat: string;
    carb: string;
}

export interface DayListFrontendStructure extends AddNewDayFrontendStructure {
    id: number;
    publicId: string;
}

export interface DayUpdateFrontendStructure extends AddNewDayFrontendStructure {
    publicId: string;
}
