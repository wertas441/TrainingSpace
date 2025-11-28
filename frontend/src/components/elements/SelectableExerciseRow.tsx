import {memo, useMemo} from "react";
import {PlusCircleIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {getColorStyles} from "@/lib";

interface SelectableExerciseRowProps {
    exercise: ExerciseTechniqueItem;
    selected: boolean;
    onToggle: (id: number) => void;
}

function SelectableExerciseRow({exercise, selected, onToggle}: SelectableExerciseRowProps) {

    const badgeClasses = `inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getColorStyles(exercise.difficulty)}`;

    return (
        <div className={`w-full rounded-lg border ${selected ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-emerald-100'} bg-white p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col space-y-2 gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
                        <span className={badgeClasses}>
                            {exercise.difficulty === 'Лёгкий' ? 'Лёгкий' : exercise.difficulty === 'Средний' ? 'Средний' : 'Сложный'}
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
                        className={`inline-flex cursor-pointer w-full  items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                            selected
                                ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                    >
                        {useMemo(() => selected
                            ? <TrashIcon className="h-4 w-4" />
                            : <PlusCircleIcon className="h-5 w-5" />, [selected])}
                        {selected ? 'Убрать' : 'Добавить'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(SelectableExerciseRow);
