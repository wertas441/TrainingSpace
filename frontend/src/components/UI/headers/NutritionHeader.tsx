import FilterInput from "@/components/inputs/FilterInput";
import {CalendarIcon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {memo, useCallback} from "react";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {NutritionHeaderProps} from "@/types/nutritionTypes";
import {useModalWindowRef} from "@/lib/hooks/useModalWindowRef";
import {useRouter} from "next/navigation";
import PlusButton from "@/components/buttons/other/PlusButton";
import BarsButton from "@/components/buttons/other/BarsButton";

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

    return (
        <div className="relative w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Питание</h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 w-full md:w-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        <div className="w-full sm:w-full md:w-60">
                            <FilterInput
                                id="nutrition-search-name"
                                placeholder="Поиск по названию дня..."
                                value={searchName}
                                onChange={(v) => onSearchNameChange(String(v))}
                                icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                            />
                        </div>

                        <div className="w-full sm:w-full md:w-60">
                            <FilterInput
                                id="nutrition-search-date"
                                type="date"
                                placeholder="Дата"
                                value={searchDate}
                                onChange={(v) => onSearchDateChange(String(v))}
                                icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-end gap-2">
                        <PlusButton
                            onClick={useCallback(() => router.push('/nutrition/add'), [router])}
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
                    <div
                        ref={modalWindowRef}
                        className="absolute right-0 top-full mt-2 z-20 w-full md:w-[560px] rounded-xl bg-white shadow-lg border border-emerald-100"
                    >
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
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 mb-2">Калории (ккал)</h1>
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
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 mb-2">Белки (г)</h1>
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
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 md:flex-row">
                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 mb-2">Жиры (г)</h1>
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
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-sm font-medium text-gray-700 mb-2">Углеводы (г)</h1>
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
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-4 border-t border-emerald-100">
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