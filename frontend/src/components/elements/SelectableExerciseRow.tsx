import {useMemo} from "react";
import {PlusCircleIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

type difficultOptions = | 'light' | 'middle' | 'hard';

interface SelectableExerciseRowProps {
    exercise: ExerciseTechniqueItem;
    selected: boolean;
    onToggle: (id: number) => void;
}

function getDifficultyStyles(difficulty: difficultOptions) {
    switch (difficulty) {
        case "light":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "middle":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "hard":
            return "border-rose-200 bg-rose-50 text-rose-700";
        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}

export default function SelectableExerciseRow({exercise, selected, onToggle}: SelectableExerciseRowProps) {
    const badgeClasses = `inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getDifficultyStyles(exercise.difficulty)}`;

    return (
        <div className={`w-full rounded-lg border ${selected ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-emerald-100'} bg-white p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
                        <span className={badgeClasses}>
                            {exercise.difficulty === 'light' ? 'Лёгкий' : exercise.difficulty === 'middle' ? 'Средний' : 'Сложный'}
                        </span>
                    </div>
                    <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
                        {exercise.partOfTheBody.map((part) => (
                            <span
                                key={part}
                                className="px-2 py-0.5 text-xs border rounded-full border-gray-200 text-gray-700 bg-gray-50"
                            >
                                {part}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="md:ml-4">
                    <button
                        type="button"
                        onClick={() => onToggle(exercise.id)}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                            selected
                                ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                    >
                        {useMemo(() => selected
                            ? <TrashIcon className="h-5 w-5" />
                            : <PlusCircleIcon className="h-5 w-5" />, [selected])}
                        {selected ? 'Убрать' : 'Добавить'}
                    </button>
                </div>
            </div>
        </div>
    );
}













