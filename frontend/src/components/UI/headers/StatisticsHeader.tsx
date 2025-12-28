import {secondDarkColorTheme} from "@/styles";

export default function StatisticsHeader() {

    return (
        <div className={`${secondDarkColorTheme} w-full border border-emerald-100 rounded-lg p-4 shadow-sm`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-semibold text-emerald-800 dark:text-white">Моя статистика</h1>
            </div>
        </div>
    )
}