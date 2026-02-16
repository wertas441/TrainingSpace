import {memo} from "react";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import {getColorStyles, secondDarkColorTheme} from "@/styles";

function ExerciseRow({id, name, description, partOfTheBody, difficulty}: ExerciseTechniqueItem) {

    return (
        <div id={`${id}`} className={`${secondDarkColorTheme} w-full rounded-lg border border-emerald-100 p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold text-gray-800 dark:text-white`}>{name}</h3>

                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getColorStyles(difficulty)}`}>
                            {difficulty === 'Лёгкий' ? 'Лёгкий' : difficulty === 'Средний' ? 'Средний' : 'Сложный'}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600 dark:text-emerald-500">
                        {description}
                    </p>
                </div>

                <div className="mt-2 md:mt-0 md:ml-4 flex flex-wrap gap-2">
                    {partOfTheBody.map((part) => (
                        <span
                            key={part}
                            className="px-2 py-0.5 text-xs border rounded-full border-emerald-200 text-emerald-800 bg-emerald-50 dark:text-white dark:bg-emerald-800 dark:border-emerald-700"
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


