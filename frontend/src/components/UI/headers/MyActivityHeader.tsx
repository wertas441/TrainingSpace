import FilterInput from "@/components/inputs/FilterInput";
import {useCallback, useMemo} from "react";
import {CalendarIcon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/24/outline";
import BarsButton from "@/components/buttons/other/BarsButton";
import {useModalWindowRef} from "@/lib/hooks/useModalWindowRef";
import {
    ActivityDifficultyStructure,
    ActivityHeaderProps,
    ActivityTypeStructure
} from "@/types/activityTypes";
import ChipToggleGroup from "@/components/inputs/ChipToggleGroup";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {secondDarkColorTheme} from "@/lib";
import XMarkButton from "@/components/buttons/other/XMarkButton";

const difficultOptions: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;
const typeOptions: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;

export default function MyActivityHeader(
    {
        searchName,
        setSearchName,
        searchDate,
        setSearchDate,
        isFilterWindowOpen,
        toggleFilterWindow,
        difficultFilter,
        setDifficultFilter,
        typeFilter,
        setTypeFilter,
    }: ActivityHeaderProps){

    const { modalWindowRef, toggleBtnRef } = useModalWindowRef(isFilterWindowOpen, toggleFilterWindow);

    const handleReset = useCallback(() => {
        setDifficultFilter(null);
        setTypeFilter(null);
        setSearchDate('');
        setSearchName('');
    }, [setDifficultFilter, setSearchDate, setSearchName, setTypeFilter]) ;

    return (
        <div className={`${secondDarkColorTheme} relative w-full border border-emerald-100 rounded-lg p-4 shadow-sm`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800 dark:text-white">Моя активность</h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full md:w-auto">
                    <div className="w-full sm:flex-1 md:w-65">
                        <FilterInput
                            id="training-search-name"
                            placeholder="Поиск по названию активности..."
                            value={searchName}
                            onChange={(v) => setSearchName(String(v))}
                            icon={useMemo(() => <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />, [])}
                        />
                    </div>

                    <div className="w-full sm:flex-1 md:w-65">
                        <FilterInput
                            id="nutrition-search-date"
                            type="date"
                            placeholder="Дата"
                            value={searchDate}
                            onChange={(v) => setSearchDate(String(v))}
                            icon={<CalendarIcon className="h-5 w-5 text-gray-300" />}
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <BarsButton
                            onClick={toggleFilterWindow}
                            ref={toggleBtnRef}
                            className={`w-full sm:w-auto`}
                        />
                    </div>
                </div>
            </div>

            {isFilterWindowOpen && (
                <div
                    ref={modalWindowRef}
                    className={`${secondDarkColorTheme} absolute right-0 top-full mt-2 z-20 w-full md:w-[520px] rounded-xl shadow-lg border border-emerald-100`}
                >
                    <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-100 dark:border-neutral-700">
                        <h2 className="text-lg font-semibold text-emerald-800 dark:text-white">Фильтры</h2>
                        <XMarkButton onClick={toggleFilterWindow} />
                    </div>
                    <div className="px-5 py-4 space-y-6">

                        <ChipToggleGroup<ActivityDifficultyStructure>
                            id="activity-difficulty"
                            label="Уровень сложности"
                            choices={difficultOptions}
                            value={difficultFilter}
                            onChange={setDifficultFilter}
                            alwaysSelected={false}
                        />

                        <ChipToggleGroup<ActivityTypeStructure>
                            id="activity-type"
                            label="Тип тренировки"
                            choices={typeOptions}
                            value={typeFilter}
                            onChange={setTypeFilter}
                            alwaysSelected={false}
                        />
                    </div>
                    <div className="px-5 py-4 border-t border-emerald-100 dark:border-neutral-700">
                        <LightGreenGlassBtn
                            label={`Сбросить`}
                            onClick={handleReset}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}