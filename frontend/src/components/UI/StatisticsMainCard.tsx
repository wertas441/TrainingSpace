import {ElementType, memo, ReactNode} from "react";

interface StatisticsMainCardProps {
    label: string;
    value: number | string;
    unit?: string;
    description?: string;
    icon?: ElementType;
    children?: ReactNode;
}

function StatisticsMainCard(
    {
        label,
        value,
        unit,
        description,
        icon: Icon,
        children,
    }: StatisticsMainCardProps) {

    return (
        <div className="flex flex-col h-full rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                        {label}
                    </p>
                    {description && (
                        <p className="text-xs text-gray-500">
                            {description}
                        </p>
                    )}
                </div>

                {Icon && (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Icon className="h-5 w-5" />
                    </span>
                )}
            </div>

            <div className="mt-1">
                <p className="text-3xl font-semibold text-emerald-900">
                    {value}
                    {unit && (
                        <span className="ml-1 text-base font-normal text-gray-500">
                            {unit}
                        </span>
                    )}
                </p>
            </div>

            {children && (
                <div className="mt-1 text-xs text-gray-500">
                    {children}
                </div>
            )}
        </div>
    );
}

export default memo(StatisticsMainCard);



