import {ElementType} from "react";

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



export type DifficultOptionsStructure = null | 'light' | 'middle' | 'hard';

export interface SettingsMenuItemsStructure{
    id: string;
    label: string;
    icon: ElementType ;
}
