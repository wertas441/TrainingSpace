import {DifficultOptionsStructure, HeaderMinimumProps} from "@/types/indexTypes";

// Элемент списка упражнений на фронтенде (совпадает по форме с ответом backend)
export interface ExerciseTechniqueItem {
    id: number;
    name: string;
    difficulty: Exclude<DifficultOptionsStructure, null>;
    description: string;
    partOfTheBody: string[];
}

export interface ExercisesTechniquesHeaderProps extends HeaderMinimumProps{
    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    difficultFilter: DifficultOptionsStructure;
    setDifficultFilter: (value: DifficultOptionsStructure) => void;
    partOfBodyFilter: string[];
    setPartOfBodyFilter: (value: string[]) => void;
    // полный список упражнений для построения фильтров по группам мышц
    exercises: ExerciseTechniqueItem[];
}