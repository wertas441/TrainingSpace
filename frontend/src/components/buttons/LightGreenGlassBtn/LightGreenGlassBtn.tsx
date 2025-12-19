import {memo} from "react";
import {SimpleButtonProps} from "@/types/indexTypes";

function LightGreenGlassBtn({label, onClick, disabled = false,  className = '', type = "button"}: SimpleButtonProps ) {

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 w-full cursor-pointer py-2 text-sm rounded-md border 
                border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:text-white dark:border-emerald-400 dark:hover:bg-neutral-800 ${className}`}
        >
            {label}
        </button>
    )
}

export default memo(LightGreenGlassBtn)