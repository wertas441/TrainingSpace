import {HeaderMinimumProps} from "@/types/indexTypes";

export type ActivityTypeStructure = 'Силовая' | 'Кардио' | 'Комбинированный';

export type ActivityDifficultyStructure = 'Лёгкая' | 'Средняя' | 'Тяжелая';

export type ActivityDifficultyFilter= ActivityDifficultyStructure | null ;

export type ActivityTypeFilter = ActivityTypeStructure | null;

export interface ActivityDataStructure {
    id: number;
    publicId: string;
    name: string;
    description: string;
    activityDate: string;
    type: ActivityTypeStructure;
    difficulty: ActivityDifficultyStructure;
    trainingId: number;
    exercises: {
        exercisesId: number;
        try: {
            id: number;
            weight: number;
            quantity: number;
        }[];
    }[];
}

export interface ActivityHeaderProps extends HeaderMinimumProps {
    searchDate: string;
    setSearchDate: (newValue: string) => void;
    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    difficultFilter: ActivityDifficultyFilter,
    setDifficultFilter: (newValue: ActivityDifficultyFilter) => void;
    typeFilter: ActivityTypeFilter,
    setTypeFilter: (newValue: ActivityTypeFilter) => void;
}


interface ExerciseSetsStructure {
    id: number;
    weight: number;
    quantity: number;
}

export type ExerciseSetsByExerciseId = Record<number, ExerciseSetsStructure[]>;