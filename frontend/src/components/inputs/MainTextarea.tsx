'use client'

import {InputsStructure} from "@/types/indexTypes";
import {mainInputClasses} from "@/lib";

interface MainTextareaProps extends InputsStructure {
    rows?: number;
}

export default function MainTextarea({label, id, required = false, placeholder, value, onChange, error, rows = 4}: MainTextareaProps) {

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}

            <div className="relative">
                <textarea
                    id={id}
                    name={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${mainInputClasses.trim()} px-4 textDescriptionArea resize-y`}
                />
            </div>

            {error && (
                <p className="pt-2 pl-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}


