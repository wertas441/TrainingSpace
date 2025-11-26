import {memo} from "react";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {DifficultOptionsStructure} from "@/types/indexTypes";

function getDifficultyStyles(difficulty: DifficultOptionsStructure) {
    switch (difficulty) {
        case "Лёгкий":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "Средний":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "Сложный":
            return "border-rose-200 bg-rose-50 text-rose-700";
        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}

function ExerciseRow({exercise}:{exercise: ExerciseTechniqueItem}) {

    const badgeClasses = `inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getDifficultyStyles(exercise.difficulty)}`;

    return (
        <div className="w-full rounded-lg border border-emerald-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
                        <span className={badgeClasses}>
                            {exercise.difficulty === 'Лёгкий' ? 'Лёгкий' : exercise.difficulty === 'Средний' ? 'Средний' : 'Сложный'}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {exercise.description}
                    </p>
                </div>

                <div className="mt-2 md:mt-0 md:ml-4 flex flex-wrap gap-2">
                    {exercise.partOfTheBody.map((part) => (
                        <span
                            key={part}
                            className="px-2 py-0.5 text-xs border rounded-full border-emerald-200 text-emerald-800 bg-emerald-50"
                        >
                            {part}
                        </span>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default memo(ExerciseRow);


