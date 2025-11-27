import {memo} from "react";
import {ChartBarIcon} from "@heroicons/react/24/outline";

function DashboardChartCard() {

    return (
        <div className="flex flex-col h-full rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                        Быстрый обзор
                    </p>
                    <h2 className="text-lg font-semibold text-emerald-900">
                        Прогресс за период
                    </h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <ChartBarIcon className="h-6 w-6" />
                </span>
            </div>

            <div className="mt-2 flex-1">
                <div className="h-40 w-full rounded-xl border-2 border-dashed border-emerald-100 bg-emerald-50/40 flex items-center justify-center text-xs text-gray-400">
                    График будет добавлен позже
                </div>
            </div>
        </div>
    );
}

export default memo(DashboardChartCard);


