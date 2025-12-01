import {memo} from "react";
import {BasicLinkBtnProps} from "@/types/indexTypes";
import Link from "next/link";

function LightGreenGlassLinkBtn({label , href = '/', className = '',}: BasicLinkBtnProps ) {

    return (
        <Link
            href={href}
            className={`px-4 w-full cursor-pointer py-2 text-sm rounded-md border 
                border-emerald-200 text-emerald-700 hover:bg-emerald-50 ${className}`}
        >
            {label}
        </Link>
    )
}

export default memo(LightGreenGlassLinkBtn)