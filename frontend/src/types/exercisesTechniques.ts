import {DifficultOptionsStructure, ExerciseDifficultFilter, HeaderMinimumProps} from "@/types/index";

export interface ExerciseTechniqueItem {
    id: number;
    name: string;
    difficulty: DifficultOptionsStructure;
    description: string;
    partOfTheBody: string[];
}

export interface ExercisesTechniquesHeaderProps extends HeaderMinimumProps{
    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    difficultFilter: ExerciseDifficultFilter;
    setDifficultFilter: (value: ExerciseDifficultFilter) => void;
    partOfBodyFilter: string[];
    setPartOfBodyFilter: (value: string[]) => void;
    exercises: ExerciseTechniqueItem[];
}