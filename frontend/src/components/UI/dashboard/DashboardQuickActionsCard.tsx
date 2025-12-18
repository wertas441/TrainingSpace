import Link from "next/link";
import {
    CalendarDaysIcon,
    SparklesIcon,
    SquaresPlusIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {memo} from "react";
import {secondDarkColorTheme, thirdDarkColorTheme} from "@/lib";

const actions = [
    {
        href: "/add-activity",
        label: "Добавить активность",
        icon: SquaresPlusIcon,
    },
    {
        href: "/my-activity",
        label: "Моя активность",
        icon: Squares2X2Icon,
    },
    {
        href: "/nutrition/add",
        label: "Добавить день",
        icon: CalendarDaysIcon,
    },
    {
        href: "/goals/add",
        label: "Добавить цель",
        icon: SparklesIcon,
    },
] as const;

function DashboardQuickActionsCard() {

    return (
        <div className={`${secondDarkColorTheme} flex flex-col h-full rounded-2xl border border-emerald-100 shadow-sm p-5 gap-4`}>
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                    Быстрые действия
                </p>
                <h2 className="text-lg font-semibold dark:text-white text-emerald-900">
                    Что сделаем сейчас?
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 auto-rows-fr">
                {actions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={`${thirdDarkColorTheme} group flex h-full w-full flex-col items-center justify-center rounded-xl border border-emerald-100
                                bg-emerald-50/40 px-4 py-4 hover:bg-emerald-50 hover:border-emerald-200 transition text-center
                                dark:hover:bg-neutral-700 hover:border-emerald-200
                                `}
                        >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 dark:text-emerald-500
                         dark:bg-neutral-900 dark:border-neutral-800 text-white
                        shadow-sm group-hover:bg-emerald-600 dark:group-hover:bg-neutral-900 transition"
                        >
                            <IconComponent className="h-5 w-5"/>
                        </span>
                            <p className="mt-2 text-sm font-semibold text-emerald-900 dark:text-white">
                                {action.label}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default memo(DashboardQuickActionsCard)
