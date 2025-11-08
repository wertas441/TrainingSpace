import {ReactNode} from "react";

export interface InputsStructure {
    id: string;
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
    required?: boolean;
    placeholder?: string;
    error?: string;
}





