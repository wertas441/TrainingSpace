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

export interface BasicIconButtonProps {
    onClick: () => void;
    className?: string;
}

export type DifficultOptionsStructure = null | 'light' | 'middle' | 'hard';

export interface SettingsMenuItemsStructure{
    id: string;
    label: string;
    link: string;
    icon: ElementType ;
}

// Тип ответа backend (совпадает с ApiResponse на сервере)
export interface BackendApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface SimpleButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}
