import {memo} from "react";

interface ChipRadioGroupProps<T extends string> {
    id: string;
    label: string;
    name: string;
    choices: T[];
    value: T;
    onChange: (v: T) => void;
    className?: string;
}

function ChipRadioGroup<T extends string>({ id, name, label, choices, value, onChange, className = "" }: ChipRadioGroupProps<T>) {

    return (
        <div className="space-y-2">
            <div className="block mb-2 text-sm font-medium text-gray-400">{label}</div>
            <div id={id} className={`flex flex-wrap gap-2 ${className}`}>
                {choices.map((choice) => {
                    const checked = value === choice;
                    return (
                        <label
                            key={choice}
                            className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
                                checked ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-gray-50 text-gray-700'
                            }`}
                        >
                            <input
                                type="radio"
                                name={name}
                                className="sr-only"
                                checked={checked}
                                value={choice}
                                onChange={() => onChange(choice)}
                            />
                            <span className={`h-3 w-3 rounded-full border ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'}`} />
                            {choice}
                        </label>
                    );
                })}
            </div>
        </div>

    );
}

const ChipRadioGroupMemo = memo(ChipRadioGroup) as typeof ChipRadioGroup;

export default ChipRadioGroupMemo;




