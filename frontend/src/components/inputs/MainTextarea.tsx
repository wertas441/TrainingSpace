import {mainInputClasses} from "@/styles";
import {memo, TextareaHTMLAttributes} from "react";
import InputError from "@/components/errors/InputError";

export interface TextAreaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
    error?: string;
    className?: string;
}

function MainTextarea(
    {
        label,
        id,
        required = false,
        placeholder,
        error,
        ...rest
    }: TextAreaInputProps) {

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
                    required={required}
                    placeholder={placeholder}
                    rows={4}
                    className={`${mainInputClasses.trim()} px-4 textDescriptionArea resize-y`}
                    {...rest}
                />
            </div>

            <InputError error={error} />
        </div>
    )
}

export default memo(MainTextarea);










