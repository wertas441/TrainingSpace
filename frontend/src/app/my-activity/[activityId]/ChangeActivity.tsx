'use client'

import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import {FormEvent, useCallback, useEffect, useState} from "react";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import {
    ActivityDataStructure,
    ActivityDifficultyStructure,
    ActivityTypeStructure,
    ExerciseSetsByExerciseId
} from "@/types/activityTypes";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {useInputField} from "@/lib/hooks/useInputField";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import type {BackendApiResponse, TrainingDataStructure} from "@/types/indexTypes";
import {deleteActivity, getTrainingExercises} from "@/lib/controllers/activityController";
import {baseUrlForBackend} from "@/lib";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
    validateActivityTrainingId
} from "@/lib/utils/validators";
import {useActivityUtils} from "@/lib/hooks/useActivityUtils";

interface ChangeActivityProps {
    activityInfo: ActivityDataStructure,
    myTrainings: TrainingDataStructure[];
    token: string;
}

const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;
const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;

export default function ChangeActivity({activityInfo, myTrainings, token}: ChangeActivityProps){

    const activityName = useInputField(activityInfo.name);
    const activityDescription = useInputField(activityInfo.description);
    const activityDate = useInputField(activityInfo.activityDate);
    const [activityType, setActivityType] = useState<ActivityTypeStructure>(activityInfo.type);
    const [activityDifficulty, setActivityDifficulty] = useState<ActivityDifficultyStructure>(activityInfo.difficulty);
    const trainingId = useInputField(String(activityInfo.trainingId));

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

    const {
        handleChangeTraining,
        trainingExercises,
        setTrainingExercises,
        trainingOptions,
        selectedTrainingOption,
        selectedTraining
    } = useActivityUtils({myTrainings, trainingId});

    const [exerciseSets, setExerciseSets] = useState<ExerciseSetsByExerciseId>(() => {
        const initial: ExerciseSetsByExerciseId = {};

        // Заполняем подходы, которые уже есть у активности
        (activityInfo.exercises || []).forEach((ex) => {
            initial[ex.exercisesId] = ex.try.map((s) => ({
                id: s.id,
                weight: s.weight,
                quantity: s.quantity,
            }));
        });

        // Добавляем "пустые" упражнения из тренировки, по которым ещё нет подходов
        const relatedTraining = myTrainings.find(
            (t) => t.id === activityInfo.trainingId
        );

        if (relatedTraining) {
            relatedTraining.exercises.forEach((exId) => {
                if (!initial[exId]) {
                    initial[exId] = [{ id: 1, weight: 0, quantity: 0 }];
                }
            });
        }

        return initial;
    });

    // Подтягиваем названия упражнений для выбранной тренировки при первой загрузке/смене тренировки
    useEffect(() => {
        const currentTrainingIdNum = Number(trainingId.inputState.value);

        if (!currentTrainingIdNum || Number.isNaN(currentTrainingIdNum)) {
            setTrainingExercises([]);
            return;
        }

        const found = myTrainings.find(t => t.id === currentTrainingIdNum);

        if (!found) {
            setTrainingExercises([]);
            return;
        }

        getTrainingExercises(found.id)
            .then(setTrainingExercises)
            .catch((err) => {
                console.error('Ошибка загрузки упражнений тренировки при редактировании активности:', err);
                setTrainingExercises([]);
            });
    }, [trainingId.inputState.value, myTrainings, setTrainingExercises]);

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
            { exercisesId: number; try: { id: number; weight: number; quantity: number }[] }[]
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
                    exercisesId: Number(exId),
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
            id: activityInfo.id,
            publicId: activityInfo.publicId,
            activityId: activityInfo.publicId,
            name: activityName.inputState.value.trim(),
            description: activityDescription.inputState.value.trim(),
            activityDate: activityDate.inputState.value,
            type: activityType,
            difficulty: activityDifficulty,
            trainingId: Number(trainingId.inputState.value),
            exercises: exercisesPayload,
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
            await deleteActivity(token, activityInfo.publicId);
            router.replace("/my-activity");
        } catch (error) {
            console.error("delete activity error:", error);
            setServerError("Не удалось удалить активность. Попробуйте ещё раз позже.");
        }
    }, [activityInfo.publicId, router, setServerError, token])

    return (
        <>
            <main className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <h1 className="text-2xl text-center font-semibold text-gray-800">Изменение активности</h1>

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
                            <p className="pl-1 text-xs text-red-500">{trainingId.inputState.error}</p>
                        )}

                        {selectedTraining && (
                            <AddTrainingActivityItem
                                selectedTraining={selectedTraining}
                                exerciseSets={exerciseSets}
                                trainingExercises={trainingExercises}
                                setExerciseSets={setExerciseSets}
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
                isExiting={isExiting}
                modalRef={windowModalRef}
                windowLabel={'Подтверждение удаления'}
                windowText={`Вы действительно хотите удалить активность ${activityInfo.name}? Это действие необратимо.`}
                error={serverError}
                cancelButtonLabel={'Отмена'}
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteActivityBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}