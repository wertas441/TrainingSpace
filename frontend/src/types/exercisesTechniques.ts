<<<<<<<< HEAD:frontend/src/types/exercisesTechniques.ts
import {DifficultOptionsStructure, ExerciseDifficultFilter, HeaderMinimumProps} from "@/types/index";
========
import {DifficultOptionsStructure, ExerciseDifficultFilter, HeaderMinimumProps} from "@/types";
>>>>>>>> a8d18cb486c8bae35cf872bec4a79e755b5cfa62:frontend/src/types/exercise.ts

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