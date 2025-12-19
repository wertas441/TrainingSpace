import {memo, useMemo} from "react";
import {PlusIcon} from "@heroicons/react/16/solid";
import {BasicIconButtonProps} from "@/types/indexTypes";
import {iconDarkColorTheme} from "@/lib";

function PlusButton({onClick, className = ''}:BasicIconButtonProps) {

    return (
        <button
            className={`inline-flex ${iconDarkColorTheme} cursor-pointer items-center justify-center rounded-md border border-emerald-200 ` +
                ` px-3 py-2 text-sm hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
        >
            {useMemo(() => <PlusIcon className={`h-6 w-6`} />, [])}
        </button>
    )
}

export default memo(PlusButton);