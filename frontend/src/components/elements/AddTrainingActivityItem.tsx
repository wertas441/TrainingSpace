import {PlusIcon} from "@heroicons/react/16/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import type {TrainingDataStructure} from "@/types/indexTypes";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import type {ExerciseSetsByExerciseId} from "@/types/activityTypes";
import {Dispatch, JSX, SetStateAction, useMemo} from "react";

interface AddTrainingActivityItemProps {
    selectedTraining: TrainingDataStructure;
    exerciseSets: ExerciseSetsByExerciseId;
    trainingExercises: ExerciseTechniqueItem[];
    setExerciseSets: Dispatch<SetStateAction<ExerciseSetsByExerciseId>>;
}

export default function AddTrainingActivityItem(
    {
        selectedTraining,
        exerciseSets,
        trainingExercises,
        setExerciseSets,
	}:AddTrainingActivityItemProps): JSX.Element{

    const TrashIconComponent = useMemo(() => <TrashIcon className="w-5 h-5 w-full" />, [])
    const PlusIconComponent = useMemo(() => <PlusIcon className="w-5 h-5 w-full" />, [])

    const addSet = (exerciseId: number) => {
        setExerciseSets(prev => {
            const current = prev[exerciseId] || [];
            const nextId = current.length > 0 ? Math.max(...current.map(s => s.id)) + 1 : 1;
            return {
                ...prev,
                [exerciseId]: [...current, { id: nextId, weight: 0, quantity: 0 }]
            };
        });
    };

    const removeSet = (exerciseId: number, setId: number) => {
        setExerciseSets(prev => {
            const current = prev[exerciseId] || [];
            const filtered = current.filter(s => s.id !== setId);
            return {
                ...prev,
                [exerciseId]: filtered.length > 0 ? filtered : [{ id: 1, weight: 0, quantity: 0 }]
            };
        });
    };

    const updateSet = (exerciseId: number, setId: number, field: 'weight' | 'quantity', value: string) => {
        const num = Number(value);
        setExerciseSets(prev => {
            const current = prev[exerciseId] || [];
            const updated = current.map(s => s.id === setId ? { ...s, [field]: isNaN(num) ? 0 : num } : s);
            return { ...prev, [exerciseId]: updated };
        });
    };



    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Упражнения из тренировки</h2>

            {selectedTraining.exercises.map((exId) => {
                const ex = trainingExercises.find(e => e.id === exId);
                const sets = exerciseSets[exId] || [{ id: 1, weight: 0, quantity: 0 }];
                return (
                    <div key={exId} className="rounded-lg border border-emerald-100 bg-white p-4">
                        <div className="flex-row sm:flex space-y-3 items-center justify-between">
                            <div className="text-gray-900 font-medium">{ex ? ex.name : `Упражнение #${exId}`}</div>
                            <button
                                type="button"
                                className="text-sm p-2 w-full md:w-auto  mr-0.5 border rounded-md cursor-pointer border-emerald-200 bg-white text-emerald-600 hover:text-emerald-700"
                                onClick={() => addSet(exId)}
                            >
                                {PlusIconComponent}
                            </button>
                        </div>

                        <div className="mt-3 space-y-4">
                            {sets.map((s) => (
                                <div key={s.id} className="grid grid-cols-12 items-end gap-2">
                                    <div className="col-span-12 sm:col-span-3">
                                        <label className="block mb-1 text-xs font-medium text-gray-500">Подход</label>
                                        <input
                                            value={s.id}
                                            disabled
                                            className="w-full h-10 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 px-3"
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-4">
                                        <label className="block mb-1 text-xs font-medium text-gray-500">Вес (кг)</label>
                                        <input
                                            type="text"
                                            value={s.weight}
                                            onChange={(e) => updateSet(exId, s.id, 'weight', e.target.value)}
                                            className="w-full h-10 text-sm border border-gray-300 rounded-md bg-white text-gray-900 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-4">
                                        <label className="block mb-1 text-xs font-medium text-gray-500">Повторения</label>
                                        <input
                                            type="text"
                                            value={s.quantity}
                                            onChange={(e) => updateSet(exId, s.id, 'quantity', e.target.value)}
                                            className="w-full h-10 text-sm border border-gray-300 rounded-md bg-white text-gray-900 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-1 py-2 sm:py-0">
                                        <button
                                            type="button"
                                            onClick={() => removeSet(exId, s.id)}
                                            className="p-2.5 w-full text-center text-sm cursor-pointer border border-gray-200 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                                        >
                                            {TrashIconComponent}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}