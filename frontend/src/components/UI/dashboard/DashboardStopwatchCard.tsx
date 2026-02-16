import {memo} from "react";
import {PlayIcon, PauseIcon, ArrowPathIcon} from "@heroicons/react/24/outline";
import {useStopwatch} from "@/lib/hooks/useStopwatch";
import {secondDarkColorTheme} from "@/styles";

function DashboardStopwatchCard() {

    const {seconds, isRunning, toggle, formatTime, reset} = useStopwatch();

    return (
        <div className={`${secondDarkColorTheme} flex flex-col justify-between h-full rounded-2xl border border-emerald-100 shadow-sm p-5 gap-4`}>
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                    Секундомер
                </p>

                <h2 className="text-lg dark:text-white font-semibold text-emerald-900">
                    Сессия тренировки
                </h2>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl dark:text-white font-mono font-semibold text-emerald-800">
                        {formatTime(seconds)}
                    </span>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={toggle}
                    className={`inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition 
                    ${isRunning
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                >
                    {isRunning ? (
                        <>
                            <PauseIcon className="h-5 w-5 mr-1.5" />
                            Пауза
                        </>
                    ) : (
                        <>
                            <PlayIcon className="h-5 w-5 mr-1.5" />
                            Старт
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={reset}
                    className="inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-xs font-medium
                     text-emerald-700 dark:text-white dark:hover:bg-neutral-700 border border-emerald-200 dark:bg-neutral-800 dark:border-neutral-700 hover:bg-emerald-50 transition"
                >
                    <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                    Сброс
                </button>
            </div>
        </div>
    );
}

export default memo(DashboardStopwatchCard)
