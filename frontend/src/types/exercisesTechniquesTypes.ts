import {DifficultOptionsStructure, HeaderMinimumProps} from "@/types/indexTypes";

export interface ExercisesTechniquesHeaderProps extends HeaderMinimumProps{
    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    difficultFilter: DifficultOptionsStructure;
    setDifficultFilter: (value: DifficultOptionsStructure) => void;
    partOfBodyFilter: string[];
    setPartOfBodyFilter: (value: string[]) => void;
}