'use client'

import ServerError from "@/shared/UI-kit/errors/ServerError";
import MainInput from "@/shared/UI-kit/inputs/MainInput";
import {useCallback, useMemo, useState} from "react";
import MainTextarea from "@/shared/UI-kit/inputs/MainTextarea";
import ChipRadioGroup from "@/shared/UI-kit/inputs/ChipRadioGroup";
import {
    ActivityDataStructure,
    ActivityDifficultyStructure, ActivityForm,
    ActivityTypeStructure,
    ExerciseSetsByExerciseId
} from "@/entities/activity/model/type";
import MainMultiSelect from "@/shared/UI-kit/inputs/MainMultiSelect";
import AddTrainingActivityItem from "@/entities/activity/UI/AddTrainingActivityItem";
import {usePageUtils} from "@/shared/hooks/usePageUtils";
import {buildExercisesPayload} from "@/entities/activity/model/controller";
import {showErrorMessage} from "@/shared";
import {useModalWindow} from "@/shared/hooks/useModalWindow";
import RedGlassBtn from "@/shared/UI-kit/buttons/RedGlassBtn";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
} from "@/entities/activity/model/validation";
import {useActivityUtils} from "@/entities/activity/useActivityUtils";
import {secondDarkColorTheme} from "@/shared/styles";
import {Controller, useForm} from "react-hook-form";
import DropDownContent from "@/widgets/UiContex/DropDownContent";
import {
    useDeleteActivityMutation,
    useUpdateActivityMutation
} from "@/entities/activity/model/mutation";
import {useTrainings} from "@/entities/training/model/data";
import LightGreenBtn from "@/shared/UI-kit/buttons/LightGreenBtn";
import ModalWindow from "@/widgets/ModalWindow";

interface IProps {
    activityInfo: ActivityDataStructure,
    token: string;
}

const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;
const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;

export default function ChangeActivity({activityInfo, token}: IProps){

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ActivityForm>({
        defaultValues: {
            name: activityInfo.name,
            description: activityInfo.description,
            date: activityInfo.activityDate,
            type: activityInfo.type,
            difficulty: activityInfo.difficulty,
            trainingId: String(activityInfo.trainingId),
        }
    })

    const { trainings } = useTrainings(token);

    const myTrainings = useMemo(() => trainings ?? [], [trainings]);

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const { isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef } = useModalWindow()

    const updateActivityMutation = useUpdateActivityMutation();
    const deleteActivityMutation = useDeleteActivityMutation();

    const trainingId = watch('trainingId');

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

        (activityInfo.exercises || []).forEach((ex) => {
            initial[ex.exercisesId] = ex.try.map((s) => ({
                id: s.id,
                weight: s.weight,
                quantity: s.quantity,
            }));
        });

        const relatedTraining = myTrainings.find(({id}) => id === activityInfo.trainingId);

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

        const found = val ? myTrainings.find(({id}) => id === Number(val)) : undefined;
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

    const onSubmit = async (values: ActivityForm)=> {
        setServerError(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        const exercisesPayload = buildExercisesPayload(exerciseSets);

        const payload = {
            id: activityInfo.id,
            publicId: activityInfo.publicId,
            activityId: activityInfo.publicId,
            name: values.name,
            description: values.description,
            activityDate: values.date,
            type: values.type,
            difficulty: values.difficulty,
            trainingId: Number(values.trainingId),
            exercises: exercisesPayload,
        }

        updateActivityMutation.mutate(payload, {
            onSuccess: () => router.replace("/my-activity"),

            onError: (err: unknown) => {
                const message = err instanceof Error ? err.message : "Не удалось изменить активность. Попробуйте ещё раз.";

                setServerError(message);
                if (showErrorMessage) console.error('change activity error:', err);
            },
        });
    }

    const deleteActivityBtn = useCallback(async () => {
        setServerError(null);

        const payload = {
            tokenValue: token,
            activityId: activityInfo.publicId,
        }

        deleteActivityMutation.mutate(payload, {
            onSuccess: () => router.replace("/my-activity"),

            onError: (err: unknown) => {
                console.error("delete activity error:", err);

                setServerError("Не удалось удалить активность. Попробуйте ещё раз позже.");
            },
        });
    }, [activityInfo.publicId, deleteActivityMutation, router, setServerError, token])

    return (
        <>
            <main className="flex items-center justify-center min-h-screen p-4">
                <div className={`${secondDarkColorTheme} w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-2xl text-center font-semibold text-gray-800 dark:text-white">Изменение активности</h1>

                        <ServerError message={serverError} />

                        <DropDownContent label={`Основная информация`} defaultOpen={true}>
                            <MainInput
                                id="name"
                                label="Название активности"
                                placeholder={`Тренировка в бассейне`}
                                error={errors.name?.message}
                                {...register('name', {validate: (value) => validateActivityName(value) || true})}
                            />

                            <MainInput
                                id={'date'}
                                type={'date'}
                                label="Дата активности"
                                error={errors.date?.message}
                                {...register('date', {validate: (value) => validateActivityDate(value) || true})}
                            />

                            <MainTextarea
                                id="description"
                                label="Описание"
                                placeholder="Опционально: комментарий к сессии"
                                error={errors.description?.message}
                                {...register('description', {validate: (value) => validateActivityDescription(value) || true})}
                            />

                            <Controller
                                control={control}
                                name="type"
                                render={({field}) => (
                                    <ChipRadioGroup<ActivityTypeStructure>
                                        id="type"
                                        label={`Тип`}
                                        choices={activityTypeChoices}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="difficulty"
                                render={({field}) => (
                                    <ChipRadioGroup<ActivityDifficultyStructure>
                                        id="difficulty"
                                        label={'Сложность'}
                                        choices={activityDifficultyChoices}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </DropDownContent>

                        <DropDownContent label={`Тренировка и подходы`}>
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
                        </DropDownContent>

                        <div className="mt-10 flex items-center gap-x-8">
                            <LightGreenBtn
                                label={!isSubmitting ? 'Изменить' : 'Процесс...'}
                                type={`submit`}
                                disabled={isSubmitting}
                            />

                            <RedGlassBtn label={'Удалить'} onClick={toggleModalWindow} />
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
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteActivityBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}