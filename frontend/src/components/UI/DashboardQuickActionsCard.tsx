import Link from "next/link";
import {
    PlusIcon,
    BoltIcon,
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    FlagIcon,
} from "@heroicons/react/24/outline";
import {memo} from "react";

const actions = [
    {
        href: "/add-activity",
        label: "Добавить активность",
        icon: BoltIcon,
    },
    {
        href: "/my-activity",
        label: "Моя активность",
        icon: ClipboardDocumentCheckIcon,
    },
    {
        href: "/training",
        label: "Добавить день",
        icon: CalendarDaysIcon,
    },
    {
        href: "/goals",
        label: "Добавить цель",
        icon: FlagIcon,
    },
] as const;

function DashboardQuickActionsCard() {

    return (
        <div className="flex  flex-col h-full rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 gap-4">
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                    Быстрые действия
                </p>
                <h2 className="text-lg font-semibold text-emerald-900">
                    Что сделаем сейчас?
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 auto-rows-fr">
                {actions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group flex h-full w-full flex-col items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-4 hover:bg-emerald-50 hover:border-emerald-200 transition text-center"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm group-hover:bg-emerald-600 transition">
                            {(() => {
                                const Icon = action.icon ?? PlusIcon;
                                return <Icon className="h-5 w-5" />;
                            })()}
                        </span>
                        <p className="mt-2 text-sm font-semibold text-emerald-900">
                            {action.label}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default memo(DashboardQuickActionsCard)
