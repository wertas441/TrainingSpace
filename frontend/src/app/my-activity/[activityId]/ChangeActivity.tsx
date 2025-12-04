'use client'

import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import {FormEvent, useCallback, useMemo, useState} from "react";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import {
    ActivityDataStructure,
    ActivityDifficultyStructure,
    ActivityTypeStructure,
    ExerciseSetsByExerciseId
} from "@/types/activityTypes";
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
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
    validateActivityTrainingId
} from "@/lib/utils/validators";

interface ChangeActivityProps {
    activityInfo: ActivityDataStructure,
    myTrainings: TrainingDataStructure[];
    token: string;
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

    const [exerciseSets, setExerciseSets] = useState<ExerciseSetsByExerciseId>(
        () => {
            const initial: ExerciseSetsByExerciseId = {};

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
            id: activityInfo.id,
            publicId: activityInfo.publicId,
            activityId: activityInfo.publicId,
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
                        <div className="space-y-2">
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