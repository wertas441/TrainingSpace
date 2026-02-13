import FilterInput from "@/components/inputs/FilterInput";
import {CalendarIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {memo, useCallback} from "react";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {NutritionHeaderProps} from "@/types/nutrition";
import {useModalWindowRef} from "@/lib/hooks/useModalWindowRef";
import {useRouter} from "next/navigation";
import PlusButton from "@/components/buttons/other/PlusButton";
import BarsButton from "@/components/buttons/other/BarsButton";
import {secondDarkColorTheme} from "@/styles";
import XMarkButton from "@/components/buttons/other/XMarkButton";

function NutritionHeader(
    {
        searchName,
        onSearchNameChange,
        searchDate,
        onSearchDateChange,
        caloriesMin,
        onCaloriesMinChange,
        caloriesMax,
        onCaloriesMaxChange,
        proteinMin,
        onProteinMinChange,
        proteinMax,
        onProteinMaxChange,
        fatMin,
        onFatMinChange,
        fatMax,
        onFatMaxChange,
        carbMin,
        onCarbMinChange,
        carbMax,
        onCarbMaxChange,
        isFilterWindowOpen,
        toggleFilterWindow,
        onResetFilters,
    }: NutritionHeaderProps) {

    const { modalWindowRef, toggleBtnRef } = useModalWindowRef(isFilterWindowOpen, toggleFilterWindow);

    const router = useRouter();
    const plusButtonAction = useCallback(() => router.push('/nutrition/add'), [router])

    return (
        <div className={`${secondDarkColorTheme} relative w-full border border-emerald-100 rounded-lg p-4 shadow-sm`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800 dark:text-white">Питание</h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 w-full md:w-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        <div className="w-full sm:w-full md:w-60">
                            <FilterInput
                                id="nutrition-search-name"
                                placeholder="Поиск по названию дня..."
                                value={searchName}
                                onChange={(v) => onSearchNameChange(String(v))}
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                error={null}
                            />
                        </div>

                        <div className="w-full sm:w-full md:w-60">
                            <FilterInput
                                id="nutrition-search-date"
                                type="date"
                                placeholder="Дата"
                                value={searchDate}
                                onChange={(v) => onSearchDateChange(String(v))}
                                icon={<CalendarIcon className="h-5 w-5" />}
                                error={null}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-end gap-2">
                        <PlusButton
                            onClick={plusButtonAction}
                            className={`w-full`}
                        />
                        <BarsButton
                            onClick={toggleFilterWindow}
                            ref={toggleBtnRef}
                            className={`w-full`}
                        />
                    </div>
                </div>

                {isFilterWindowOpen && (
                    <div ref={modalWindowRef}
                        className={`${secondDarkColorTheme} absolute right-0 top-full mt-2 z-20 w-full md:w-[560px] 
                        rounded-xl shadow-lg border border-emerald-100`}
                    >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-100 dark:border-neutral-700">
                            <h2 className="text-lg font-semibold text-emerald-800 dark:text-white">Фильтры</h2>
                            <XMarkButton onClick={toggleFilterWindow} />
                        </div>
                        <div className="px-5 py-4 space-y-6">
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Калории</h1>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FilterInput
                                            id="calories-min"
                                            label="От"
                                            placeholder="0"
                                            value={Number.isFinite(caloriesMin) ? caloriesMin : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onCaloriesMinChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                        <FilterInput
                                            id="calories-max"
                                            label="До"
                                            placeholder="5000"
                                            value={Number.isFinite(caloriesMax) ? caloriesMax : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onCaloriesMaxChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Белки</h1>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FilterInput
                                            id="protein-min"
                                            label="От"
                                            placeholder="0"
                                            value={Number.isFinite(proteinMin) ? proteinMin : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onProteinMinChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                        <FilterInput
                                            id="protein-max"
                                            label="До"
                                            placeholder="300"
                                            value={Number.isFinite(proteinMax) ? proteinMax : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onProteinMaxChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 md:flex-row">
                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Жиры</h1>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FilterInput
                                            id="fat-min"
                                            label="От"
                                            placeholder="0"
                                            value={Number.isFinite(fatMin) ? fatMin : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onFatMinChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                        <FilterInput
                                            id="fat-max"
                                            label="До"
                                            placeholder="200"
                                            value={Number.isFinite(fatMax) ? fatMax : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onFatMaxChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Углеводы</h1>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FilterInput
                                            id="carb-min"
                                            label="От"
                                            placeholder="0"
                                            value={Number.isFinite(carbMin) ? carbMin : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onCarbMinChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                        <FilterInput
                                            id="carb-max"
                                            label="До"
                                            placeholder="400"
                                            value={Number.isFinite(carbMax) ? carbMax : ''}
                                            onChange={(v) => {
                                                const s = String(v);
                                                onCarbMaxChange(s.trim() === '' ? Number.NaN : Number(s));
                                            }}
                                            error={null}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-4 border-t border-emerald-100 dark:border-neutral-700">
                            <LightGreenGlassBtn
                                label={`Сбросить`}
                                onClick={onResetFilters}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(NutritionHeader);