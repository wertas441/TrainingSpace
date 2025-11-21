import FilterInput from "@/components/inputs/FilterInput";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {memo, useCallback, useMemo} from "react";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {useModalWindowRef} from "@/lib/hooks/useModalWindowRef";
import {ExercisesTechniquesHeaderProps} from "@/types/exercisesTechniquesTypes";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import BarsButton from "@/components/buttons/BarsButton";
import {difficultOptions} from "@/lib";
import {DifficultOptionsStructure} from "@/types/indexTypes";

function ExercisesTechniquesHeader(
    {
        searchName,
        setSearchName,
        isFilterWindowOpen,
        toggleFilterWindow,
        difficultFilter,
        setDifficultFilter,
        partOfBodyFilter,
        setPartOfBodyFilter,
        exercises,
        ref,
    }: ExercisesTechniquesHeaderProps){

    const { modalWindowRef, toggleBtnRef } = useModalWindowRef(isFilterWindowOpen, toggleFilterWindow);

    // Опции для react-select из данных упражнений
    const muscleOptions = useMemo(() => {
        const set = new Set<string>();
        exercises.forEach(e => e.partOfTheBody.forEach(p => set.add(p)));
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .map(v => ({ value: v, label: v }));
    }, [exercises]);

    const selectedMuscles = useMemo(
        () => muscleOptions.filter(o => partOfBodyFilter.includes(o.value)),
        [partOfBodyFilter, muscleOptions]
    );

    const handleToggleDifficulty = (value: Exclude<DifficultOptionsStructure, null>) => {
        setDifficultFilter(difficultFilter === value ? null : value);
    };

    const handleMusclesChange = (vals: readonly { value: string; label: string }[]) => {
        setPartOfBodyFilter(vals.map(v => v.value));
    };

    const handleReset = useCallback(() => {
        setDifficultFilter(null);
        setPartOfBodyFilter([]);
    }, [setDifficultFilter, setPartOfBodyFilter]) ;

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm relative" ref={ref}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Техника выполнения упражнений</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-full md:w-80">
                        <FilterInput
                            id="exercise-search"
                            value={searchName}
                            onChange={(v) => setSearchName(String(v))}
                            placeholder="Поиск по названию упражнения..."
                            icon={useMemo(() => <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />, [])}
                        />
                    </div>



                    <BarsButton
                        onClick={toggleFilterWindow}
                        ref={toggleBtnRef}
                    />
                </div>

                {isFilterWindowOpen && (
                    <div ref={modalWindowRef} className="absolute right-0 top-full mt-2 z-20 w-full md:w-[520px] rounded-xl bg-white shadow-lg border border-emerald-100">
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
                            <div>
                                <div className="flex gap-1 mb-3">
                                    <h1 className={`text-sm font-medium text-emerald-900`}>Сложность</h1>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {difficultOptions.map(opt => {
                                        const active = difficultFilter === (opt.key as Exclude<DifficultOptionsStructure, null>);
                                        return (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                onClick={() => handleToggleDifficulty(opt.key as Exclude<DifficultOptionsStructure, null>)}
                                                className={`px-3 py-2 cursor-pointer rounded-lg text-sm border transition 
                                                    ${active 
                                                        ? `bg-emerald-600 text-white border-emerald-600 shadow` 
                                                        : `bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50`}`}
                                            >
                                                <span className={`mr-2 inline-block h-4 w-4 rounded-md border ${active ? 'bg-white/90' : 'bg-white border-emerald-300'}`} />
                                                {opt.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-emerald-900 mb-3">Группы мышц</div>
                                <MainMultiSelect
                                    id="muscle-groups"
                                    options={muscleOptions}
                                    value={selectedMuscles}
                                    onChange={(vals) => handleMusclesChange(vals as { value: string; label: string }[])}
                                    placeholder="Выберите группы..."
                                />
                                <div className="mt-1.5 text-xs text-gray-500">По умолчанию показываются все группы</div>
                            </div>
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
        </div>
    )
}

export default memo(ExercisesTechniquesHeader)