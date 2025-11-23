import {memo, useMemo} from "react";
import {PlusIcon} from "@heroicons/react/16/solid";
import {BasicIconButtonProps} from "@/types/indexTypes";

function PlusButton({onClick, className = ''}:BasicIconButtonProps) {

    return (
        <button
            className={'inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-200 ' +
                `bg-white px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
        >
            {useMemo(() => <PlusIcon className={`h-6 w-6 text-emerald-600`} />, [])}
        </button>
    )
}

export default memo(PlusButton);