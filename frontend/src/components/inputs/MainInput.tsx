import {mainInputClasses} from "@/lib";
import {ReactNode} from "react";
import {InputsStructure} from "@/types/indexTypes";

interface MainInputProps extends InputsStructure  {
    type?: string;
    icon?: ReactNode;
}

export function MainInput({label, id, type = 'text', icon, required = false, placeholder,
                              value, onChange, error}: MainInputProps) {

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">
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
                    className={`${mainInputClasses.trim()} ${icon ? 'pl-10 pr-4' : 'px-4'}`}
                />
            </div>

            {error && (
                <p className="pt-2 pl-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}