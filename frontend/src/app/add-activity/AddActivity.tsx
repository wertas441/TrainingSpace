'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {MainInput} from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import ServerError from "@/components/errors/ServerError";
import {exercises as exercisesDirectory} from "@/lib/data/exercises";
import {baseUrlForBackend} from "@/lib";
import type {TrainingDataStructure} from "@/types/indexTypes";
import MainMultiSelect, {OptionType} from "@/components/inputs/MainMultiSelect";
import {PlusIcon} from "@heroicons/react/16/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import {ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activityTypes";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";

interface AddActivityProps {
    myTrainings: TrainingDataStructure[];
    activityTypeChoices: ActivityTypeStructure[];
    activityDifficultyChoices: ActivityDifficultyStructure[];
}

export default function AddActivity({myTrainings, activityTypeChoices, activityDifficultyChoices}: AddActivityProps) {

    const activityName = useInputField('');
    const activityDescription = useInputField('');
    const [activityType, setActivityType] = useState<ActivityTypeStructure>('Силовая');
    const [activityDifficulty, setActivityDifficulty] = useState<ActivityDifficultyStructure>('Средняя');
    const trainingId = useInputField('');

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const trainingOptions: OptionType[] = useMemo(
        () => myTrainings.map(t => ({ value: String(t.id), label: t.name })),
        [myTrainings]
    );

    const selectedTrainingOption: OptionType[] = useMemo(() => {
        const found = trainingOptions.find(o => o.value === trainingId.inputState.value);
        return found ? [found] : [];
    }, [trainingOptions, trainingId.inputState.value]);

    // Состояние подходов по каждому упражнению выбранной тренировки
    // Ключ: exerciseId, Значение: массив подходов { id, weight, quantity }
    const [exerciseSets, setExerciseSets] = useState<Record<number, { id: number; weight: number; quantity: number; }[]>>({});

    const selectedTraining = useMemo(
        () => trainingId.inputState.value ? myTrainings.find(t => t.id === Number(trainingId.inputState.value)) : undefined,
        [trainingId.inputState.value, myTrainings]
    );

    // Инициализировать подходы при выборе тренировки
    const initSetsForTraining = (training?: TrainingDataStructure) => {
        if (!training) {
            setExerciseSets({});
            return;
        }
        const next: Record<number, { id: number; weight: number; quantity: number; }[]> = {};
        training.exercises.forEach(exId => {
            next[exId] = [{ id: 1, weight: 0, quantity: 0 }];
        });
        setExerciseSets(next);
    };

    const handleChangeTraining = (val: string) => {
        trainingId.setValue(val);
        const found = val ? myTrainings.find(t => t.id === Number(val)) : undefined;
        initSetsForTraining(found);
    };

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

    const validateForm = (): boolean => {
        if (!activityName.inputState.value.trim()) {
            activityName.setError('Введите название активности');
            return false;
        }
        if (!trainingId.inputState.value) {
            trainingId.setError('Выберите тренировку-шаблон');
            return false;
        }
        // Простая проверка подходов
        for (const exIdStr of Object.keys(exerciseSets)) {
            const exId = Number(exIdStr);
            for (const s of exerciseSets[exId] || []) {
                if (s.weight < 0 || s.quantity <= 0) {
                    setServerError('Проверьте поля подходов: вес не может быть отрицательным, повторения > 0');
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: activityName.inputState.value.trim(),
            description: activityDescription.inputState.value.trim(),
            type: activityType,
            difficulty: activityDifficulty,
            trainingId: Number(trainingId.inputState.value),
            exercises: Object.entries(exerciseSets).map(([exId, sets]) => ({
                id: Number(exId),
                try: sets.map(s => ({
                    id: s.id,
                    weight: s.weight,
                    quantity: s.quantity,
                }))
            }))
        };

        try {
            const result = await fetch(`${baseUrlForBackend}/api/activity/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                router.push("/my-activity");
                return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setServerError(result.message || "Не удалось добавить активность. Проверьте корректность данных.");
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Проверьте интернет-соединение или попробуйте позже.");
            console.error("Add activity error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-gray-800">Добавить активность</h1>
                        <p className="text-sm text-gray-500">Выберите тренировку и введите подходы по упражнениям</p>
                    </div>

                    <ServerError message={serverError} />

                    <MainInput
                        id="activityName"
                        label="Название активности"
                        required
                        placeholder="Например: Грудь + трицепс"
                        value={activityName.inputState.value}
                        onChange={activityName.setValue}
                        error={activityName.inputState.error || undefined}
                    />

                    <MainTextarea
                        id="activityDescription"
                        label="Описание"
                        placeholder="Опционально: комментарий к сессии"
                        value={activityDescription.inputState.value}
                        onChange={activityDescription.setValue}
                        error={activityDescription.inputState.error || undefined}
                        rows={4}
                    />

                    <ChipRadioGroup<ActivityTypeStructure>
                        id="activity-type"
                        name="activityType"
                        label={`Тип`}
                        choices={activityTypeChoices}
                        value={activityType}
                        onChange={setActivityType}
                    />

                    <ChipRadioGroup<ActivityDifficultyStructure>
                        id="activity-difficulty"
                        label={'Сложность'}
                        name="activityDifficulty"
                        choices={activityDifficultyChoices}
                        value={activityDifficulty}
                        onChange={setActivityDifficulty}
                    />

                    <MainMultiSelect
                        id="trainingId"
                        label="Тренировка"
                        options={trainingOptions}
                        value={selectedTrainingOption}
                        onChange={(vals) => handleChangeTraining(vals[0]?.value ?? '')}
                        placeholder="Выберите тренировку-шаблон"
                        isMulti={false}
                        noOptionsMessage={() => 'Нет тренировок'}
                    />
                    {trainingId.inputState.error && (
                        <p className="pt-2 pl-1 text-xs text-red-500">{trainingId.inputState.error}</p>
                    )}

                    {selectedTraining && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800">Упражнения из тренировки</h2>

                            {selectedTraining.exercises.map((exId) => {
                                const ex = exercisesDirectory.find(e => e.id === exId);
                                const sets = exerciseSets[exId] || [{ id: 1, weight: 0, quantity: 0 }];
                                return (
                                    <div key={exId} className="rounded-lg border border-emerald-100 bg-white p-4">
                                        <div className="flex-row sm:flex space-y-3 items-center justify-between">
                                            <div className="text-gray-900 font-medium">{ex ? ex.name : `Упражнение #${exId}`}</div>
                                            <button
                                                type="button"
                                                className="text-sm p-2  mr-0.5 border rounded-md cursor-pointer border-emerald-200 bg-white text-emerald-600 hover:text-emerald-700"
                                                onClick={() => addSet(exId)}
                                            >
                                                <PlusIcon className="w-5 h-5" />
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
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <LightGreenSubmitBtn label="Сохранить активность" disabled={isSubmitting} />
                </form>
            </div>
        </main>
    )
}