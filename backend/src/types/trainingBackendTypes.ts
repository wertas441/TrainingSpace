
export interface AddTrainingFrontendStructure {
    name: string;
    description: string;
    exercises: number[];
}

export interface TrainingListFrontendStructure extends AddTrainingFrontendStructure {
    id: number;
    publicId: string;
}

export interface TrainingUpdateFrontendStructure extends AddTrainingFrontendStructure {
    trainingId: string;
}

