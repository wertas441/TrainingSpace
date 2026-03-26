'use client'

import { ReactNode, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface IProps {
    children: ReactNode;
    label: string;
    className?: string;
    defaultOpen?: boolean;
    contentClassName?: string;
    triggerClassName?: string;
}

export default function DropDownContent(
    {
        children,
        label,
        className = '',
        defaultOpen = false,
        contentClassName = '',
        triggerClassName = '',
    }: IProps) {

    const [open, setOpen] = useState<boolean>(defaultOpen);

    return (
        <section
            className={`rounded-2xl border border-emerald-100 dark:border-neutral-700 bg-white dark:bg-neutral-900/95 dark:ring-0 backdrop-blur
            ${open ? 'ring-2 ring-emerald-400/15' : ''} ${className}`}
        >
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                className={`flex cursor-pointer w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition
                hover:bg-emerald-50 dark:hover:bg-emerald-600 focus:outline-none focus-visible:ring-2  ${triggerClassName}`}
            >
                <div className="min-w-0">
                    <h3 className={`truncate text-base sm:text-lg font-semibold tracking-tight text-emerald-800 dark:text-white`}>
                        {label}
                    </h3>
                </div>

                <ArrowRightIcon
                    className={`h-5 w-5 shrink-0 text-emerald-800 dark:text-white transition-transform duration-200 ${open ? 'rotate-90' : 'rotate-0'}`}
                    aria-hidden="true"
                />
            </button>

            <div
                aria-hidden={!open}
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className={`px-4 py-4 ${contentClassName}`}>
                        <div className="space-y-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}