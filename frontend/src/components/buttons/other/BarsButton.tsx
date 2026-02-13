import {memo, Ref, useMemo} from "react";
import {Bars3Icon} from "@heroicons/react/24/outline";
import {BasicIconButtonProps} from "@/types";
import {iconDarkColorTheme} from "@/styles";

interface BarsButtonProps extends BasicIconButtonProps {
    ref?: Ref<HTMLButtonElement>;
}

function BarsButton({onClick, className = '', ref}: BarsButtonProps){

    return (
        <button
            className={`inline-flex ${iconDarkColorTheme}  cursor-pointer items-center justify-center rounded-md border border-emerald-200 ` +
                ` px-3 py-2 text-sm hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
            ref={ref}
        >
            {useMemo(() => <Bars3Icon className={`h-6 w-6 `} />, [])}
        </button>
    )
}

export default memo(BarsButton);