'use client'

import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import {useCallback, useState} from "react";
import MainTextarea from "@/components/inputs/MainTextarea";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import {
    ActivityDataStructure,
    ActivityDifficultyStructure, ActivityFormValues,
    ActivityTypeStructure,
    ExerciseSetsByExerciseId
} from "@/types/activityTypes";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import type {BackendApiResponse, TrainingDataStructure} from "@/types/indexTypes";
import {deleteActivity} from "@/lib/controllers/activityController";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
} from "@/lib/utils/validators";
import {useActivityUtils} from "@/lib/hooks/useActivityUtils";
import {secondDarkColorTheme} from "@/styles";
import {Controller, useForm} from "react-hook-form";

interface ChangeActivityProps {
    activityInfo: ActivityDataStructure,
    myTrainings: TrainingDataStructure[];
    token: string;
}

const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;
const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;

export default function ChangeActivity({activityInfo, myTrainings, token}: ChangeActivityProps){

    const {register, handleSubmit, control, setValue, watch, formState: { errors }} = useForm<ActivityFormValues>({
        defaultValues: {
            activityName: activityInfo.name,
            activityDescription: activityInfo.description,
            activityDate: activityInfo.activityDate,
            activityType: activityInfo.type,
            activityDifficulty: activityInfo.difficulty,
            trainingId: String(activityInfo.trainingId),
        }
    })

    const trainingId = watch('trainingId')
    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

    const {
        handleChangeTraining,
        trainingExercises,
        trainingOptions,
        selectedTrainingOption,
        selectedTraining
    } = useActivityUtils({
        myTrainings,
        trainingId,
        onTrainingIdChange: (val) => setValue('trainingId', val, { shouldDirty: true, shouldValidate: true }),
    });


    const [setsErrors, setSetsError] = useState<string  | null>(null)
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

    const handleTrainingSelect = (val: string) => {
        setSetsError(null);
        handleChangeTraining(val);

        const found = val ? myTrainings.find(t => t.id === Number(val)) : undefined;
        if (!found) {
            setExerciseSets({});
            return;
        }

        setExerciseSets((prev) => {
            const next: ExerciseSetsByExerciseId = {};
            found.exercises.forEach((exId) => {
                next[exId] = prev[exId] ?? [{ id: 1, weight: 0, quantity: 0 }];
            });
            return next;
        });
    };

    const validateForm = (): boolean => {
        const setsError = validateActivitySets(exerciseSets);
        if (setsError) {
            setSetsError(setsError);
        } else {
            setSetsError(null);
        }

        return !(setsError);
    };

    const onSubmit = async (values: ActivityFormValues)=> {
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
            requestData: {
                id: activityInfo.id,
                publicId: activityInfo.publicId,
                activityId: activityInfo.publicId,
                name: values.activityName,
                description: values.activityDescription,
                activityDate: values.activityDate,
                type: values.activityType,
                difficulty: values.activityDifficulty,
                trainingId: Number(values.trainingId),
                exercises: exercisesPayload,
            }
        }

        try {
            await api.put<BackendApiResponse>('/activity/activity', payload)

            router.replace("/my-activity");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('change activity error:', err);

            setIsSubmitting(false);
        }
    }

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
                <div className={`${secondDarkColorTheme} w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-2xl text-center font-semibold text-gray-800 dark:text-white">Изменение активности</h1>

                        <ServerError message={serverError} />

                        <MainInput
                            id="activityName"
                            label="Название активности"
                            placeholder={`Тренировка в бассейне`}
                            error={errors.activityName?.message}
                            {...register('activityName', {validate: (value) => validateActivityName(value) || true})}
                        />

                        <MainInput
                            id={'activityDate'}
                            type={'date'}
                            label="Дата активности"
                            error={errors.activityDate?.message}
                            {...register('activityDate', {validate: (value) => validateActivityDate(value) || true})}
                        />

                        <MainTextarea
                            id="activityDescription"
                            label="Описание"
                            placeholder="Опционально: комментарий к сессии"
                            error={errors.activityDescription?.message}
                            {...register('activityDescription', {validate: (value) => validateActivityDescription(value) || true})}
                        />

                        <Controller
                            control={control}
                            name="activityType"
                            render={({field}) => (
                                <ChipRadioGroup<ActivityTypeStructure>
                                    id="activityType"
                                    label={`Тип`}
                                    choices={activityTypeChoices}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="activityDifficulty"
                            render={({field}) => (
                                <ChipRadioGroup<ActivityDifficultyStructure>
                                    id="activityDifficulty"
                                    label={'Сложность'}
                                    choices={activityDifficultyChoices}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <MainMultiSelect
                            id="trainingId"
                            label="Тренировка"
                            options={trainingOptions}
                            value={selectedTrainingOption}
                            onChange={(vals) => handleTrainingSelect(vals[0]?.value ?? '')}
                            placeholder="Выберите тренировку"
                            isMulti={false}
                            noOptionsMessage={() => 'Нет тренировок'}
                            error={undefined}
                        />

                        {setsErrors && (
                            <p className=" pl-1 text-xs text-red-500">{setsErrors}</p>
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