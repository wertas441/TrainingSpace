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
    const difficultOptions: ActivityDifficultyStructure[] = useMemo(() => ['Лёгкая', 'Средняя', 'Тяжелая'], []);
    const typeOptions: ActivityTypeStructure[] = useMemo(() => ['Силовая', 'Кардио', 'Комбинированный'], []);

    const handleReset = useCallback(() => {
        setDifficultFilter(null);
        setTypeFilter(null);
        setSearchDate('');
        setSearchName('');
    }, [setDifficultFilter, setSearchDate, setSearchName, setTypeFilter]) ;

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Моя активность</h1>
                </div>

                <div className="flex items-center gap-5 ">
                    <div className="flex items-center gap-5">
                        <div className="w-full md:w-65">
                            <FilterInput
                                id="training-search-name"
                                placeholder="Поиск по названию активности..."
                                value={searchName}
                                onChange={(v) => setSearchName(String(v))}
                                icon={useMemo(() => <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />, [])}
                            />
                        </div>

                        <div className="w-full md:w-65">
                            <FilterInput
                                id="nutrition-search-date"
                                type="date"
                                placeholder="Дата"
                                value={searchDate}
                                onChange={(v) => setSearchDate(String(v))}
                                icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                            />
                        </div>

                        <div className="flew-row md:flex gap-2 ">
                            <BarsButton
                                onClick={toggleFilterWindow}
                                ref={toggleBtnRef}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isFilterWindowOpen && (
                <div ref={modalWindowRef} className="absolute right-1 z-20 w-full md:w-[520px] rounded-xl bg-white shadow-lg border border-emerald-100">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100">
                        <h2 className="text-lg font-semibold text-emerald-800">Фильтры</h2>
                        <button
                            onClick={toggleFilterWindow}
                            className="rounded-md px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                        >
                            <XMarkIcon className="h-6 w-6 text-emerald-600" />
                        </button>
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
                    <div className="px-5 py-4 border-t border-emerald-100">
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