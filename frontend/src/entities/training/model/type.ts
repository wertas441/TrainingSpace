
export interface TrainingForm {
    name: string;
    description: string;
}

export interface TrainingListResponse {
    id: number;
    publicId: string;
    name: string;
    description: string;
    exercises: number[];
}
