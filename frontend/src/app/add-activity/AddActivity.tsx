'use client'

import {useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import ServerError from "@/components/errors/ServerError";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import type {BackendApiResponse, TrainingDataStructure} from "@/types";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import MainInput from "@/components/inputs/MainInput";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
} from "@/lib/utils/validators";
import {useActivityUtils} from "@/lib/hooks/useActivityUtils";
import {secondDarkColorTheme} from "@/styles";
import {Controller, useForm} from "react-hook-form";
import {ActivityDifficultyStructure, ActivityFormValues, ActivityTypeStructure} from "@/types/activity";

const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;
const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;

export default function AddActivity({myTrainings}: {myTrainings: TrainingDataStructure[]; }) {

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const {register, handleSubmit, control, setValue, watch, formState: { errors }} = useForm<ActivityFormValues>({
        defaultValues: {
            activityDate: initialDate,
            activityType: 'Силовая',
            activityDifficulty: 'Средняя',
        }
    })

    const trainingId = watch('trainingId')
    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();
    const [setsErrors, setSetsError] = useState<string  | null>(null)

    const {
        exerciseSets,
        setExerciseSets,
        trainingExercises,
        trainingOptions,
        selectedTrainingOption,
        selectedTraining,
        handleChangeTraining
    } = useActivityUtils({
        myTrainings,
        trainingId,
        onTrainingIdChange: (val) => setValue('trainingId', val, { shouldDirty: true, shouldValidate: true }),
    });

    const handleTrainingSelect = (val: string) => {
        setSetsError(null);
        handleChangeTraining(val);
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
            requestData: {
                activityName: values.activityName,
                description: values.activityDescription,
                performedAt: values.activityDate,
                activityType: values.activityType,
                activityDifficult: values.activityDifficulty,
                trainingId: Number(values.trainingId),
                exercises: exercisesPayload,
            }
        }

        try {
            await api.post<BackendApiResponse>('/activity/activity', payload)

            router.push("/my-activity");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('add activity error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div className={`${secondDarkColorTheme} w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Добавить активность</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Выберите тренировку и введите подходы по упражнениям</p>
                    </div>

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
                        noOptionsMessage={() => 'У вас пока не создано ни одной тренировки или вы неправильно ввели название'}
                        error={undefined}
                    />

                    {selectedTraining && (
                        <div className="space-y-10">
                            <AddTrainingActivityItem
                                selectedTraining={selectedTraining}
                                exerciseSets={exerciseSets}
                                trainingExercises={trainingExercises}
                                setExerciseSets={setExerciseSets}
                            />

                            {setsErrors && (
                                <p className=" pl-1 text-xs text-red-500">{setsErrors}</p>
                            )}

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