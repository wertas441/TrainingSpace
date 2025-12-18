import {InputsStructure} from "@/types/indexTypes";
import {memo, ReactNode} from "react";
import {thirdDarkColorTheme} from "@/lib";

interface FilterInputProps extends InputsStructure<string | number> {
    type?: string;
    icon?: ReactNode;
}

function FilterInput(
    {
        label,
        id,
        type = 'text',
        icon,
        required = false,
        placeholder,
        value,
        onChange,
        error
    }: FilterInputProps) {

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-1 text-xs font-medium text-gray-500">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {icon}
                    </div>
                )}

                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    placeholder={placeholder}
                    className={`w-full ${thirdDarkColorTheme} h-10 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-400 ease-in-out duration-300 transition-shadow 
                    ${icon ? 'pl-9 pr-3' : 'px-3'}`}
                />
            </div>

            {error && (
                <p className="pt-1 pl-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}

export default memo(FilterInput);








