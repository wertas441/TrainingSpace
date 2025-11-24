import {memo} from "react";
import {SimpleButtonProps} from "@/types/indexTypes";

function RedGlassBtn({label, onClick, className = '', disabled = false, type = "button"}: SimpleButtonProps ) {

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 w-full cursor-pointer py-2.5 text-sm rounded-md border 
                border-red-200 text-red-700 hover:bg-red-50 ${className}`}
        >
            {label}
        </button>
    )
}

export default memo(RedGlassBtn)