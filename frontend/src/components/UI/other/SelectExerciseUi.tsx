import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

interface SelectExerciseUiProps {
    selectedExerciseIds: number[];
    exercisesError: string | null;
    exercises: ExerciseTechniqueItem[];
    handleToggleExercise: (exerciseId: number) => void;
}

export default function SelectExerciseUi({selectedExerciseIds, exercisesError, exercises, handleToggleExercise}: SelectExerciseUiProps){

    return (
        <div className="mt-2">
            <div className="text-sm font-medium text-emerald-900 mb-2">
                Выбранные упражнения ({selectedExerciseIds.length})
            </div>
            {exercisesError && (
                <div className="mb-2 text-sm text-rose-600">{exercisesError}</div>
            )}
            {selectedExerciseIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {selectedExerciseIds.map(id => {
                        const ex = exercises.find(e => e.id === id);
                        if (!ex) return null;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleToggleExercise(id)}
                                className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs hover:bg-emerald-100"
                            >
                                {ex.name}
                                <span className=" rounded-full bg-white/60 px-1.5 py-1 text-xs border border-emerald-200">убрать</span>
                            </button>
                        )
                    })}
                </div>
            ) : (
                <div className="text-sm text-gray-500">
                    Пока ничего не выбрано — добавьте упражнения из списка выше
                </div>
            )}
        </div>
    )
}