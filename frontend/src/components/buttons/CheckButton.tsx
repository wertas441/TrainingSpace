import {memo, useMemo} from "react";
import {BasicIconButtonProps} from "@/types";
import {CheckIcon} from "@heroicons/react/24/outline";
import {iconDarkColorTheme} from "@/styles";

function CheckButton({onClick, className = '', disabled}:BasicIconButtonProps) {

    const baseClasses = `inline-flex ${iconDarkColorTheme} items-center justify-center rounded-md border border-emerald-200 px-3 py-2 text-sm transition `;
    const enabledClasses = 'cursor-pointer bg-white text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100';
    const disabledClasses = 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-60';

    return (
        <button
            type="button"
            disabled={disabled}
            className={baseClasses + (disabled ? disabledClasses : enabledClasses) + ` ${className}`}
            onClick={onClick}
        >
            {useMemo(() => <CheckIcon className={`h-6 w-6 `} />, [])}
        </button>
    )
}

export default memo(CheckButton);