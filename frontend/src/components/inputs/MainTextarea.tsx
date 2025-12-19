import {InputsStructure} from "@/types/indexTypes";
import {mainInputClasses} from "@/lib";
import {memo} from "react";
import InputError from "@/components/errors/InputError";

interface MainTextareaProps extends InputsStructure<string> {
    rows?: number;
}

function MainTextarea(
    {
        label,
        id,
        required = false,
        placeholder,
        value,
        onChange,
        error,
        rows = 4
    }: MainTextareaProps) {

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300">
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

            <InputError error={error} />
        </div>
    )
}

export default memo(MainTextarea);










