import {memo} from "react";

interface IProps {
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-[3px]',
    lg: 'h-8 w-8 border-4',
} as const;

function Spinner({label = 'Загрузка...', size = 'md', className = ''}: IProps) {

    return (
        <div className={`flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300 ${className}`}>
            <span
                className={`${sizeStyles[size]} animate-spin rounded-full border-emerald-200 border-t-emerald-600 dark:border-neutral-600 dark:border-t-emerald-400`}
                aria-hidden="true"
            />

            <span>{label}</span>
        </div>
    );
}

export default memo(Spinner);
