'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import ServerError from "@/components/errors/ServerError";
import {baseUrlForBackend} from "@/lib";
import type {BackendApiResponse, TrainingDataStructure} from "@/types/indexTypes";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import {ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activityTypes";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import MainInput from "@/components/inputs/MainInput";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
    validateActivityTrainingId
} from "@/lib/utils/validators";
import {useActivityUtils} from "@/lib/hooks/useActivityUtils";

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

    const {
        exerciseSets,
        setExerciseSets,
        trainingExercises,
        trainingOptions,
        selectedTrainingOption,
        selectedTraining,
        handleChangeTraining
    } = useActivityUtils({myTrainings, trainingId});

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

        // Оставляем только те упражнения и подходы, где вес и повторения > 0
        const exercisesPayload = Object.entries(exerciseSets).reduce<
            { id: number; try: { id: number; weight: number; quantity: number }[] }[]
        >((acc, [exId, sets]) => {
            const validSets = (sets || []).filter(
                (s) =>
                    Number.isFinite(s.weight) &&
                    s.weight > 0 &&
                    Number.isFinite(s.quantity) &&
                    s.quantity > 0
            );

            if (validSets.length > 0) {
                acc.push({
                    id: Number(exId),
                    try: validSets.map((s) => ({
                        id: s.id,
                        weight: s.weight,
                        quantity: s.quantity,
                    })),
                });
            }

            return acc;
        }, []);

        const payload = {
            activity_name: activityName.inputState.value.trim(),
            description: activityDescription.inputState.value.trim(),
            performed_at: activityDate.inputState.value,
            activity_type: activityType,
            activity_difficult: activityDifficulty,
            training_id: Number(trainingId.inputState.value),
            exercises: exercisesPayload,
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
                        noOptionsMessage={() => 'У вас пока не создано ни одной тренировки или вы неправильно ввели название'}
                    />

                    {selectedTraining && (
                        <div className="space-y-10">
                            <AddTrainingActivityItem
                                selectedTraining={selectedTraining}
                                exerciseSets={exerciseSets}
                                trainingExercises={trainingExercises}
                                setExerciseSets={setExerciseSets}
                            />

                            <p className=" pl-1 text-xs text-red-500">{trainingId.inputState.error}</p>

                            <LightGreenSubmitBtn
                                label={!isSubmitting ? "Сохранить активность" : 'Сохранение...' }
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                </form>
            </div>
        </main>
    )
}