import {DifficultOptionsStructure} from "@/types/indexTypes";
import {Ref} from "react";

export interface ExercisesTechniquesHeaderProps {
    searchName: string;
    onSearchChange: (value: string) => void;
    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    difficultFilter: DifficultOptionsStructure;
    setDifficultFilter: (value: DifficultOptionsStructure) => void;
    partOfBodyFilter: string[];
    ref: Ref<HTMLDivElement>;
    setPartOfBodyFilter: (value: string[]) => void;
}