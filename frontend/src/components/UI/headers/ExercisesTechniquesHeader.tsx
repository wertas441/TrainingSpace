import FilterInput from "@/components/inputs/FilterInput";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {memo, useCallback, useMemo} from "react";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {useModalWindowRef} from "@/lib/hooks/useModalWindowRef";
import {ExercisesTechniquesHeaderProps} from "@/types/exercisesTechniquesTypes";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import BarsButton from "@/components/buttons/other/BarsButton";
import {DifficultOptionsStructure} from "@/types/indexTypes";
import ChipToggleGroup from "@/components/inputs/ChipToggleGroup";

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
    }: ExercisesTechniquesHeaderProps){

    const difficultOptions: DifficultOptionsStructure[] = useMemo(() => ['Лёгкий', 'Средний', 'Сложный'], []);
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

    const handleMusclesChange = (vals: readonly { value: string; label: string }[]) => {
        setPartOfBodyFilter(vals.map(v => v.value));
    };

    const handleReset = useCallback(() => {
        setDifficultFilter(null);
        setPartOfBodyFilter([]);
    }, [setDifficultFilter, setPartOfBodyFilter]) ;

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm relative" >
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

                            <ChipToggleGroup<DifficultOptionsStructure>
                                id="exeercises-difficulty"
                                label="Уровень сложности"
                                choices={difficultOptions}
                                value={difficultFilter}
                                onChange={setDifficultFilter}
                                alwaysSelected={false}
                            />

                            <div>
                                <MainMultiSelect
                                    id="muscle-groups"
                                    label={'Группы мышц'}
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