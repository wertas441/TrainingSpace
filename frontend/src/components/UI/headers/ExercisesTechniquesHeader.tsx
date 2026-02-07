import FilterInput from "@/components/inputs/FilterInput";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {memo, useCallback, useMemo} from "react";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {useModalWindowRef} from "@/lib/hooks/useModalWindowRef";
import {ExercisesTechniquesHeaderProps} from "@/types/exercise";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import BarsButton from "@/components/buttons/other/BarsButton";
import {DifficultOptionsStructure} from "@/types";
import ChipToggleGroup from "@/components/inputs/ChipToggleGroup";
import {secondDarkColorTheme} from "@/styles";
import XMarkButton from "@/components/buttons/other/XMarkButton";

interface ValueOptions {
    value: string;
    label: string
}

const difficultOptions: DifficultOptionsStructure[] =  ['Лёгкий', 'Средний', 'Сложный'] as const;

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

    const { modalWindowRef, toggleBtnRef } = useModalWindowRef(isFilterWindowOpen, toggleFilterWindow);

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

    const handleMusclesChange = useCallback((vals: ValueOptions[]) => {
        setPartOfBodyFilter(vals.map(v => v.value));
    }, [setPartOfBodyFilter]) ;

    const handleReset = useCallback(() => {
        setDifficultFilter(null);
        setPartOfBodyFilter([]);
    }, [setDifficultFilter, setPartOfBodyFilter]) ;

    return (
        <div className={`${secondDarkColorTheme} w-full border border-emerald-100 rounded-lg p-4 shadow-sm relative`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800 dark:text-white">Техника выполнения упражнений</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-full md:w-80">
                        <FilterInput
                            id="exercise-search"
                            value={searchName}
                            onChange={(v) => setSearchName(String(v))}
                            placeholder="Поиск по названию упражнения..."
                            icon={useMemo(() => <MagnifyingGlassIcon className="h-4 w-4" />, [])}
                            error={null}
                        />
                    </div>

                    <BarsButton
                        onClick={toggleFilterWindow}
                        ref={toggleBtnRef}
                    />
                </div>

                {isFilterWindowOpen && (
                    <div ref={modalWindowRef} className={`${secondDarkColorTheme} absolute right-0 top-full mt-2 z-20 w-full md:w-[520px] rounded-xl shadow-lg border border-emerald-100`}>
                        <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-100 dark:border-neutral-700">
                            <h2 className="text-lg font-semibold text-emerald-800 dark:text-white">Фильтры</h2>
                            <XMarkButton onClick={toggleFilterWindow} />
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
                                    error={undefined}
                                />
                                <div className="mt-1.5 text-xs text-gray-500">По умолчанию показываются все группы</div>
                            </div>
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
        </div>
    )
}

export default memo(ExercisesTechniquesHeader)