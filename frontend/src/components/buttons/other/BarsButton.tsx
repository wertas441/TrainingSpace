import {memo, Ref, useMemo} from "react";
import {Bars3Icon} from "@heroicons/react/24/outline";
import {BasicIconButtonProps} from "@/types/indexTypes";

interface BarsButtonProps extends BasicIconButtonProps {
    ref?: Ref<HTMLButtonElement>;
}

function BarsButton({onClick, className = '', ref}: BarsButtonProps){

    return (
        <button
            className={'inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-200 ' +
                `bg-white px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
            ref={ref}
        >
            {useMemo(() => <Bars3Icon className={`h-6 w-6 text-emerald-600`} />, [])}
        </button>
    )
}

export default memo(BarsButton);