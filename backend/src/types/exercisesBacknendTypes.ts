
export interface ExerciseListFrontendStructure {
    id: number;
    name: string;
    difficulty: 'light' | 'middle' | 'hard';
    description: string;
    partOfTheBody: string[];
}