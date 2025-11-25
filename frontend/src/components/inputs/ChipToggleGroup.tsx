import {memo} from "react";

interface ChipToggleGroupProps<T extends string> {
    id?: string;
    label?: string;
    /**
     * Массив значений, как раньше: ['Силовая', 'Кардио', ...]
     */
    choices: readonly T[];
    /**
     * Текущее значение; может быть null, если выбор не обязателен
     */
    value: T | null;
    onChange: (v: T | null) => void;
    className?: string;
    /**
     * Если true — всегда должен быть выбран один вариант,
     * повторный клик по активному варианту ничего не делает.
     * Если false — повторный клик по активному варианту снимает выбор (value -> null).
     */
    alwaysSelected?: boolean;
    /**
     * Кастомный рендер текста на чипе (например, маппинг 'light' -> 'Легкий')
     */
    getLabel?: (value: T) => string;
}

function ChipToggleGroup<T extends string>({
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
                <div className="block mb-1 text-sm font-medium text-emerald-900">
                    {label}
                </div>
            )}
            <div id={id} className={`flex flex-wrap gap-2 ${className}`}>
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
                            className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition
                                ${active
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm'
                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
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
