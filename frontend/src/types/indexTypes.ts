import {ElementType, Ref} from "react";

export interface InputsStructure<T extends string | number> {
    id: string;
    label?: string;
    value: T;
    onChange: (newValue: T ) => void;
    required?: boolean;
    placeholder?: string;
    error?: string;
}

// icon?: ComponentType<SVGProps<SVGSVGElement>>; //

// const today = new Date().toLocaleDateString();

export interface TrainingDataStructure {
    id: number;
    name: string;
    description: string;
    exercises: number[];
}

export interface HeaderMinimumProps {
    ref: Ref<HTMLDivElement>;
    searchName: string;
    setSearchName: (newValue: string) => void;
}

export interface BasicButtonProps {
    onClick: () => void;
    className?: string;
}

export type DifficultOptionsStructure = null | 'light' | 'middle' | 'hard';

export interface SettingsMenuItemsStructure{
    id: string;
    label: string;
    icon: ElementType ;
}
