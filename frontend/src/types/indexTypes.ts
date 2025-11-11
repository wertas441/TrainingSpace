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


export type DifficultOptionsStructure = null | 'light' | 'middle' | 'hard';

