import FilterInput from "@/components/inputs/FilterInput";
import {Bars3Icon, MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {DifficultOptionsStructure} from "@/types/indexTypes";
import {useEffect, useMemo, useRef} from "react";
import Select from "react-select";
import {difficultOptions, exercises} from "@/lib/data/exercises";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";

interface ExercisesTechniquesHeaderProps {
    searchName: string;
    onSearchChange: (value: string) => void;
    isFilterWindowOpen: boolean;
    toggleFilterWindow: () => void;
    difficultFilter: DifficultOptionsStructure;
    setDifficultFilter: (value: DifficultOptionsStructure) => void;
    partOfBodyFilter: string[];
    setPartOfBodyFilter: (value: string[]) => void;
}

export default function ExercisesTechniquesHeader(
    {
        searchName,
        onSearchChange,
        isFilterWindowOpen,
        toggleFilterWindow,
        difficultFilter,
        setDifficultFilter,
        partOfBodyFilter,
        setPartOfBodyFilter,
    }: ExercisesTechniquesHeaderProps){

    // Опции для react-select из данных упражнений
    const panelRef = useRef<HTMLDivElement | null>(null);
    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!isFilterWindowOpen) return;
        const handleOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (panelRef.current && panelRef.current.contains(target)) return;
            if (toggleBtnRef.current && toggleBtnRef.current.contains(target)) return;
            toggleFilterWindow();
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isFilterWindowOpen, toggleFilterWindow]);

    // Опции для react-select из данных упражнений
    const muscleOptions = useMemo(() => {
        const set = new Set<string>();
        exercises.forEach(e => e.partOfTheBody.forEach(p => set.add(p)));
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .map(v => ({ value: v, label: v }));
    }, []);

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

    const handleReset = () => {
        setDifficultFilter(null);
        setPartOfBodyFilter([]);
    };

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm relative">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Техника выполнения упражнений</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-full md:w-80">
                        <FilterInput
                            id="exercise-search"
                            value={searchName}
                            onChange={onSearchChange}
                            placeholder="Поиск по названию..."
                            icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                        />
                    </div>

                    <button
                        className={'inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition'}
                        onClick={toggleFilterWindow}
                        ref={toggleBtnRef}
                    >
                        <Bars3Icon className={`h-6 w-6 text-emerald-600`} />
                    </button>
                </div>

                {isFilterWindowOpen && (
                    <div ref={panelRef} className="absolute right-0 top-full mt-2 z-20 w-full md:w-[520px] rounded-xl bg-white shadow-lg border border-emerald-100">
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
                                    <h1 className={`text-sm font-medium mb-0.5 text-emerald-900`}>Сложность</h1>
                                    <h2 className={`ml-1 self-center text-xs text-gray-500`}>(по умолчанию: все)</h2>
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
                                <div className="text-sm font-medium text-emerald-900 mb-2">Группы мышц</div>
                                <Select
                                    classNamePrefix="rs"
                                    isMulti={true}
                                    placeholder="Выберите группы..."
                                    options={muscleOptions}
                                    value={selectedMuscles}
                                    onChange={(vals) => handleMusclesChange(vals as { value: string; label: string }[])}
                                    noOptionsMessage={() => 'Нет опций'}
                                />
                                <div className="mt-1 text-xs text-gray-500">По умолчанию показываются все группы</div>
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