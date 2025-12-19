import {memo, ReactNode, useState} from "react";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";
import {mainInputClasses} from "@/lib";
import {InputsStructure} from "@/types/indexTypes";
import InputError from "@/components/errors/InputError";

interface MainHideInputProps extends InputsStructure<string> {
    icon?: ReactNode;
}

function MainHideInput(
    {
        label,
        id,
        icon,
        required = false,
        placeholder,
        value,
        onChange,
        error
    }:MainHideInputProps){

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300">
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
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    placeholder={placeholder}
                    className={`${mainInputClasses.trim()} ${icon ? 'pl-10 pr-4' : 'px-4'}`}
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-6 w-6 text-gray-400 mr-1" aria-hidden="true" />
                    ) : (
                        <EyeIcon className="h-6 w-6 text-gray-400 mr-1" aria-hidden="true" />
                    )}
                </div>

            </div>

            <InputError error={error} />
        </div>
    )
}

export default memo(MainHideInput)