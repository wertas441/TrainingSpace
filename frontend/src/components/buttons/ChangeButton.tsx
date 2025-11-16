import {memo, useMemo} from "react";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {BasicButtonProps} from "@/types/indexTypes";

function ChangeButton({onClick, className = ''}:BasicButtonProps){

    return (
        <button
            className={`inline-flex cursor-pointer  items-center justify-center rounded-md border border-emerald-200 bg-white
                         py-2 px-3 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
        >
            {useMemo(() => <PencilSquareIcon className={`h-6 w-6 text-emerald-600`} />, [] )}
        </button>
    )
}

export default memo(ChangeButton);