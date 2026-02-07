import Link from "next/link";
import {BasicLinkBtnProps} from "@/types";

export default function LightGreenLinkBtn({label, href = '/', className = ''}: BasicLinkBtnProps) {

    return (
        <Link
            href={href}
            className={`w-full font-semibold p-2 rounded-md cursor-pointer 
            bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 
            disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
            {label}
        </Link>
    )
}

