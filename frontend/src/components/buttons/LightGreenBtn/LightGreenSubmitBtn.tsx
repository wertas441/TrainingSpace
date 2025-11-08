import {LightGreenBtnProps} from "@/components/buttons/LightGreenBtn/LightGreenBtn";
import {memo} from 'react'

function LightGreenSubmitBtn({label, disabled = false, className = ''}: LightGreenBtnProps) {

    return (
        <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent 
            rounded-md shadow-sm text-m font-medium cursor-pointer 
            bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
            disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
        >
            {label}
        </button>
    )
}

export default memo(LightGreenSubmitBtn)

