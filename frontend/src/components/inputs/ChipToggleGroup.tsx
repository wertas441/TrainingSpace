import {memo} from "react";

interface ChipToggleGroupProps<T extends string> {
    id?: string;
    label?: string;
    choices: readonly T[];
    value: T | null;
    onChange: (v: T | null) => void;
    className?: string;
    alwaysSelected?: boolean;
    getLabel?: (value: T) => string;
}

function ChipToggleGroup<T extends string>(
    {
        id,
        label,
        choices,
        value,
        onChange,
        className = "",
        alwaysSelected = false,
        getLabel,
    }: ChipToggleGroupProps<T>) {

    return (
        <div className="space-y-2">
            {label && (
                <div className="block mb-3 text-sm font-medium text-gray-500 dark:text-gray-300">
                    {label}
                </div>)
            }
            <div id={id} className={`flex flex-wrap gap-1 md:gap-2 ${className}`}>
                {choices.map((choice) => {
                    const active = value === choice;
                    const labelText = getLabel ? getLabel(choice) : choice;

                    return (
                        <button
                            key={choice}
                            type="button"
                            onClick={() => {
                                if (active && alwaysSelected) return;
                                onChange(active ? null : choice);
                            }}
                            className={`cursor-pointer inline-flex dark:text-white items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition
                                ${active
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-neutral-700'
                                : 'border-gray-200 dark:border-neutral-700 bg-gray-50 text-gray-700 dark:bg-neutral-800'
                            }`}
                        >
                            <span
                                className={`h-3 w-3 rounded-full border
                                    ${active
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-gray-300 bg-white'
                                    }`}
                            />
                            {labelText}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const ChipToggleGroupMemo = memo(ChipToggleGroup) as typeof ChipToggleGroup;

export default ChipToggleGroupMemo;
