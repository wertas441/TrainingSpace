
import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import {memo} from "react";
import {secondDarkColorTheme} from "@/styles";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

function DashboardCalendarCard() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-11
    const day = today.getDate();

    const monthFormatter = new Intl.DateTimeFormat("ru-RU", {month: "long"});
    const monthName = monthFormatter.format(today);

    function getMonthMatrix(year: number, month: number) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstWeekday = (firstDay.getDay() + 6) % 7; // 0 - Пн, 6 - Вс

        const daysInMonth = lastDay.getDate();
        const matrix: (number | null)[] = [];

        for (let i = 0; i < firstWeekday; i++) {
            matrix.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            matrix.push(d);
        }
        while (matrix.length % 7 !== 0) {
            matrix.push(null);
        }
        return matrix;
    }

    const days = getMonthMatrix(year, month);

    return (
        <div className={`${secondDarkColorTheme} flex flex-col h-full rounded-2xl border border-emerald-100 shadow-sm p-5 gap-4`}>
            <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                        Календарь
                    </p>
                    <h2 className="text-lg font-semibold dark:text-white text-emerald-900">
                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
                    </h2>
                </div>
                <div className="inline-flex items-center rounded-full bg-emerald-50  dark:text-white dark:bg-neutral-800 dark:border-neutral-800 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                    <CalendarDaysIcon className="h-4 w-4 mr-1.5 mb-1" />
                    Сегодня: {day} число
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3 text-xs text-center mt-1">
                {weekDays.map((label) => (
                    <div key={label} className="text-[11px] font-medium text-gray-500 dark:text-gray-400 py-1">
                        {label}
                    </div>
                ))}
                {days.map((d, idx) => {
                    const isToday = d === day;
                    return (
                        <div
                            key={idx}
                            className={`flex cursor-pointer items-center justify-center h-7 rounded-full text-[12px] 
                            ${d === null
                                ? "text-transparent"
                                : isToday
                                    ? "bg-emerald-500 text-white font-semibold shadow-sm"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-neutral-700 cursor-default"}`}
                        >
                            {d ?? "-"}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(DashboardCalendarCard);
