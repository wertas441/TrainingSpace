'use client'

import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import {FormEvent, useCallback, useMemo, useState} from "react";
import {CalendarIcon, TagIcon} from "@heroicons/react/24/outline";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import {ActivityDataStructure, ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activityTypes";
import MainMultiSelect, {OptionType} from "@/components/inputs/MainMultiSelect";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {useInputField} from "@/lib/hooks/useInputField";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import type {BackendApiResponse, TrainingDataStructure} from "@/types/indexTypes";
import {deleteActivity, getTrainingExercises} from "@/lib/controllers/activityController";
import {baseUrlForBackend} from "@/lib";
import ModalWindow from "@/components/UI/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";

interface ChangeActivityProps {
    activityInfo: ActivityDataStructure,
    myTrainings: TrainingDataStructure[];
    token: string | undefined;
}

export default function ChangeActivity({activityInfo, myTrainings, token}: ChangeActivityProps){

    const activityName = useInputField(activityInfo.name);
    const activityDescription = useInputField(activityInfo.description);
    const activityDate = useInputField(activityInfo.activityDate);
    const [activityType, setActivityType] = useState<ActivityTypeStructure>(activityInfo.type);
    const [activityDifficulty, setActivityDifficulty] = useState<ActivityDifficultyStructure>(activityInfo.difficulty);
    const trainingId = useInputField(String(activityInfo.trainingId));

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

    const [exerciseSets, setExerciseSets] = useState<Record<number, { id: number; weight: number; quantity: number; }[]>>(
        () => {
            const initial: Record<number, { id: number; weight: number; quantity: number; }[]> = {};

            activityInfo.exercises.forEach((ex) => {
                initial[ex.exercisesId] = ex.try.map((s) => ({
                    id: s.id,
                    weight: s.weight,
                    quantity: s.quantity,
                }));
            });

            return initial;
        }
    );

    const [trainingExercises, setTrainingExercises] = useState<ExerciseTechniqueItem[]>([]);
    const activityTypeChoices: ActivityTypeStructure[] = useMemo(() => ['Силовая', 'Кардио', 'Комбинированный'], []) ;
    const activityDifficultyChoices: ActivityDifficultyStructure[] = useMemo(() => ['Лёгкая', 'Средняя', 'Тяжелая'], []) ;

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
        if (found) {
            getTrainingExercises(found.id)
                .then(setTrainingExercises)
                .catch((err) => {
                    console.error('Ошибка загрузки упражнений тренировки:', err);
                    setTrainingExercises([]);
                });
        } else {
            setTrainingExercises([]);
        }
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

        const payload: ActivityDataStructure = {
            id: activityInfo.id,
            name: activityName.inputState.value.trim(),
            description: activityDescription.inputState.value.trim(),
            activityDate: activityDate.inputState.value,
            type: activityType,
            difficulty: activityDifficulty,
            trainingId: Number(trainingId.inputState.value),
            exercises: Object.entries(exerciseSets).map(([exId, sets]) => ({
                exercisesId: Number(exId),
                try: sets.map(s => ({
                    id: s.id,
                    weight: s.weight,
                    quantity: s.quantity,
                }))
            }))
        };

        try {
            const result = await fetch(`${baseUrlForBackend}/api/activity/update-my-activity`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                router.replace("/my-activity");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка изменения активности. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("change activity error:", error);
            setIsSubmitting(false);
        }
    };

    const deleteActivityBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteActivity(token, activityInfo.id);
            router.replace("/my-activity");
        } catch (error) {
            console.error("delete activity error:", error);
            setServerError("Не удалось удалить активность. Попробуйте ещё раз позже.");
        }
    }, [activityInfo.id, router, setServerError, token])

    return (
        <>
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
                                trainingExercises={trainingExercises}
                            />
                        )}

                        <div className="mt-10 flex items-center gap-x-8">
                            <LightGreenSubmitBtn
                                label={!isSubmitting ? 'Изменить' : 'Процесс...'}
                                disabled={isSubmitting}
                            />
                            <RedGlassBtn
                                label = {'Удалить активность'}
                                onClick = {toggleModalWindow}
                            />
                        </div>
                    </form>
                </div>
            </main>

            <ModalWindow
                isExiting = {isExiting}
                modalRef = {windowModalRef}
                windowLabel = {'Подтверждение удаления'}
                windowText = {`Вы действительно хотите удалить активность ${activityInfo.name}? Это действие необратимо.`}
                error = {serverError}
                cancelButtonLabel = {'Отмена'}
                cancelFunction = {toggleModalWindow}
                confirmButtonLabel = {'Удалить'}
                confirmFunction = {deleteActivityBtn}
                isProcess = {isProcess}
                isRendered = {isRendered}
            />
        </>
    )
}