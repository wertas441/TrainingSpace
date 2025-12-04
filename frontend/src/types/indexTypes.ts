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
    publicId: string;
    name: string;
    description: string;
    exercises: number[];
}

export interface HeaderMinimumProps {
    searchName: string;
    setSearchName: (newValue: string) => void;
}

export interface BasicIconButtonProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export interface BasicLinkBtnProps {
    label: string;
    href?: string;
    className?: string;
}


export type DifficultOptionsStructure = 'Лёгкий' | 'Средний' | 'Сложный';

export type ExerciseDifficultFilter = DifficultOptionsStructure | null;

export interface SettingsMenuItemsStructure{
    id: string;
    label: string;
    link: string;
    icon: ElementType ;
}

// Тип ответа backend
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

export interface UserProfileRequest {
    publicId: string;
    email: string;
    userName: string;
    createdAt: string | Date;
}