
export interface AddTrainingFrontendStructure {
    name: string;
    description: string;
    exercises: number[];
}

export interface TrainingListFrontendStructure extends AddTrainingFrontendStructure {
    id: number;
}

export interface AddTrainingModelRequestStructure extends AddTrainingFrontendStructure {
    user_id: number;
}

