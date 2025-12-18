import {memo, useMemo} from "react";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {BasicIconButtonProps} from "@/types/indexTypes";
import {iconDarkColorTheme} from "@/lib";

function ChangeButton({onClick, className = ''}:BasicIconButtonProps){

    return (
        <button
            className={`${iconDarkColorTheme} inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-200 
                         py-2 px-3 text-sm hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
        >
            {useMemo(() => <PencilSquareIcon className={`h-6 w-6 `} />, [] )}
        </button>
    )
}

export default memo(ChangeButton);