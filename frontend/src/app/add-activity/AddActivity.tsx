'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import ServerError from "@/components/errors/ServerError";
import {baseUrlForBackend} from "@/lib";
import type {TrainingDataStructure} from "@/types/indexTypes";
import MainMultiSelect, {OptionType} from "@/components/inputs/MainMultiSelect";
import {ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activityTypes";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import MainInput from "@/components/inputs/MainInput";
import {CalendarIcon, TagIcon} from "@heroicons/react/24/outline";

interface AddActivityProps {
    myTrainings: TrainingDataStructure[];
    activityTypeChoices: ActivityTypeStructure[];
    activityDifficultyChoices: ActivityDifficultyStructure[];
}

export default function AddActivity({myTrainings, activityTypeChoices, activityDifficultyChoices}: AddActivityProps) {

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const activityName = useInputField('');
    const activityDescription = useInputField('');
    const activityDate = useInputField(initialDate);
    const [activityType, setActivityType] = useState<ActivityTypeStructure>('Силовая');
    const [activityDifficulty, setActivityDifficulty] = useState<ActivityDifficultyStructure>('Средняя');
    const trainingId = useInputField('');

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const [exerciseSets, setExerciseSets] = useState<Record<number, { id: number; weight: number; quantity: number; }[]>>({});


    const trainingOptions: OptionType[] = useMemo(
        () => myTrainings.map(t => ({ value: String(t.id), label: t.name })),
        [myTrainings]
    );

    const selectedTrainingOption: OptionType[] = useMemo(() => {
        const found = trainingOptions.find(o => o.value === trainingId.inputState.value);
        return found ? [found] : [];
    }, [trainingOptions, trainingId.inputState.value]);

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
            activityDate: activityDate.inputState.value,
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
                        icon={useMemo(() => <TagIcon className="h-5 w-5 text-gray-500" />, [])}
                        label="Название активности"
                        placeholder={`Например: Тренировка груди`}
                        value={activityName.inputState.value}
                        onChange={activityName.setValue}
                        error={activityName.inputState.error || undefined}
                    />

                    <MainInput
                        id={'activityDate'}
                        type={'date'}
                        icon={useMemo(() => <CalendarIcon className="h-5 w-5 text-gray-500" />, [])}
                        label="Дата активности"
                        value={activityDate.inputState.value}
                        onChange={activityDate.setValue}
                        error={activityDate.inputState.error || undefined}
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
                        placeholder="Выберите тренировку"
                        isMulti={false}
                        noOptionsMessage={() => 'Нет тренировок'}

                    />

                    {trainingId.inputState.error && (
                        <p className="pt-2 pl-1 text-xs text-red-500">{trainingId.inputState.error}</p>
                    )}

                    {selectedTraining && (
                        <AddTrainingActivityItem
                            selectedTraining={selectedTraining}
                            exerciseSets={exerciseSets}
                            addSet={addSet}
                            updateSet={updateSet}
                            removeSet={removeSet}
                        />
                    )}

                    <LightGreenSubmitBtn
                        label={!isSubmitting ? "Сохранить активность" : 'Сохранение...' }
                        disabled={isSubmitting}
                    />
                </form>
            </div>
        </main>
    )
}