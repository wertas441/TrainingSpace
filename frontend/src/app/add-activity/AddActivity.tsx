'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import ServerError from "@/components/errors/ServerError";
import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse, TrainingDataStructure} from "@/types/indexTypes";
import MainMultiSelect, {OptionType} from "@/components/inputs/MainMultiSelect";
import {ActivityDifficultyStructure, ActivityTypeStructure, ExerciseSetsByExerciseId} from "@/types/activityTypes";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import MainInput from "@/components/inputs/MainInput";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {getTrainingExercises} from "@/lib/controllers/activityController";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
    validateActivityTrainingId
} from "@/lib/utils/validators";

const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;
const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;

export default function AddActivity({myTrainings}: {myTrainings: TrainingDataStructure[]; }) {

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const activityName = useInputField('');
    const activityDescription = useInputField('');
    const activityDate = useInputField(initialDate);
    const [activityType, setActivityType] = useState<ActivityTypeStructure>('Силовая');
    const [activityDifficulty, setActivityDifficulty] = useState<ActivityDifficultyStructure>('Средняя');
    const trainingId = useInputField('');

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const [exerciseSets, setExerciseSets] = useState<ExerciseSetsByExerciseId>({});
    const [trainingExercises, setTrainingExercises] = useState<ExerciseTechniqueItem[]>([]);

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
        const next: ExerciseSetsByExerciseId = {};
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

    const validateForm = (): boolean => {
        const nameError = validateActivityName(activityName.inputState.value);
        activityName.setError(nameError);

        const dateError = validateActivityDate(activityDate.inputState.value);
        activityDate.setError(dateError);

        const descriptionError = validateActivityDescription(activityDescription.inputState.value);
        activityDescription.setError(descriptionError);

        const trainingError = validateActivityTrainingId(trainingId.inputState.value);
        trainingId.setError(trainingError);

        const setsError = validateActivitySets(exerciseSets);
        if (setsError) {
            trainingId.setError(setsError);
        }

        return !(nameError || dateError || descriptionError || trainingError || setsError);
    };

    const handleSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            activity_name: activityName.inputState.value.trim(),
            description: activityDescription.inputState.value.trim(),
            performed_at: activityDate.inputState.value,
            activity_type: activityType,
            activity_difficult: activityDifficulty,
            training_id: Number(trainingId.inputState.value),
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
            const result = await fetch(`${baseUrlForBackend}/api/activity/add-new-activity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                router.push("/my-activity");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка добавление активности. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Add new activity error:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Добавить активность</h1>
                        <p className="text-sm text-gray-500">Выберите тренировку и введите подходы по упражнениям</p>
                    </div>

                    <ServerError message={serverError} />

                    <MainInput
                        id="activityName"
                        label="Название активности"
                        placeholder={`Тренировка в бассейне`}
                        value={activityName.inputState.value}
                        onChange={activityName.setValue}
                        error={activityName.inputState.error || undefined}
                    />

                    <MainInput
                        id={'activityDate'}
                        type={'date'}
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
                        <p className=" pl-1 text-xs text-red-500">{trainingId.inputState.error}</p>
                    )}

                    {selectedTraining && (
                        <AddTrainingActivityItem
                            selectedTraining={selectedTraining}
                            exerciseSets={exerciseSets}
                            trainingExercises={trainingExercises}
                            setExerciseSets={setExerciseSets}
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