export interface InputsStructure {
    id: string;
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
    required?: boolean;
    placeholder?: string;
    error?: string;
}

// icon?: ComponentType<SVGProps<SVGSVGElement>>; //


export type DifficultOptionsStructure = null | 'light' | 'middle' | 'hard';

