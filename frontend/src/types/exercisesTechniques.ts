import {DifficultOptionsStructure} from "@/types";

export interface ExerciseTechniqueItem {
    id: number;
    name: string;
    difficulty: DifficultOptionsStructure;
    description: string;
    partOfTheBody: string[];
}
