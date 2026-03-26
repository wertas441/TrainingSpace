import {DifficultOptionsStructure} from "@/shared/types";

export interface ExerciseTechniqueItem {
    id: number;
    name: string;
    difficulty: DifficultOptionsStructure;
    description: string;
    partOfTheBody: string[];
}
