import Link from "next/link";

export interface LightGreenLinkBtnProps {
    label: string;
    href?: string;
    className?: string;
}

export default function LightGreenLinkBtn({label, href = '/', className = ''}: LightGreenLinkBtnProps) {

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

