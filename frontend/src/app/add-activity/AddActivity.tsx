'use client'

import {useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import ServerError from "@/components/errors/ServerError";
import {serverApi, getServerErrorMessage, showErrorMessage} from "@/lib";
import type {BackendApiResponse} from "@/types";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import {ActivityDifficultyStructure, ActivityFormValues, ActivityTypeStructure} from "@/types/activity";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import AddTrainingActivityItem from "@/components/elements/AddTrainingActivityItem";
import MainInput from "@/components/inputs/MainInput";
import {
    validateActivityDate,
    validateActivityDescription,
    validateActivityName,
    validateActivitySets,
} from "@/lib/utils/validators/activity";
import {useActivityUtils} from "@/lib/hooks/useActivityUtils";
import HalfContentRow from "@/components/elements/HalfContentRow";
import {
    ChartBarSquareIcon,
    ClipboardDocumentCheckIcon,
    FireIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import {Controller, useForm} from "react-hook-form";
import {buildExercisesPayload} from "@/lib/controllers/activity";
import DropDownContent from "@/components/UI/UiContex/DropDownContent";
import {useTrainings} from "@/lib/hooks/data/training";
import {useCreateActivityMutation} from "@/lib/hooks/mutations/activity";

const activityTypeChoices: ActivityTypeStructure[] = ['Силовая', 'Кардио', 'Комбинированный'] as const;
const activityDifficultyChoices: ActivityDifficultyStructure[] = ['Лёгкая', 'Средняя', 'Тяжелая'] as const;

export default function AddActivity({token} : {token: string}) {

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const {register, handleSubmit, control, setValue, watch, formState: { errors }} = useForm<ActivityFormValues>({
        defaultValues: {
            activityDate: initialDate,
            activityType: 'Силовая',
            activityDifficulty: 'Средняя',
        }
    })

    const { trainings } = useTrainings(token);

    const { serverError, setServerError, isSubmitting, setIsSubmitting, router } = usePageUtils();

    const [setsErrors, setSetsError] = useState<string  | null>(null)

    const trainingId = watch('trainingId')

    const myTrainings = useMemo(() => trainings ?? [], [trainings])
    const createActivityMutation = useCreateActivityMutation();

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

        const exercisesPayload = buildExercisesPayload(exerciseSets);

        const payload = {
            activityName: values.activityName,
            description: values.activityDescription,
            performedAt: values.activityDate,
            activityType: values.activityType,
            activityDifficult: values.activityDifficulty,
            trainingId: Number(values.trainingId),
            exercises: exercisesPayload,
        }

        createActivityMutation.mutate(payload, {
            onSuccess: () => router.push("/my-activity"),

            onError: (err) => {
                const message = err instanceof Error ? err.message : "Не удалось добавить активность. Попробуйте ещё раз.";

                setServerError(message);
                if (showErrorMessage) console.error('add activity error:', err);
            },
        });
    }

    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-7xl items-start gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:gap-8">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 sm:p-8">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                    <form className="relative z-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                Добавить активность
                            </h1>

                            <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                                Выберите тренировку и введите подходы по упражнениям
                            </p>
                        </div>

                        <ServerError message={serverError} />

                        <DropDownContent label={`Основная информация`} defaultOpen={true}>
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
                        </DropDownContent>

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

                        {selectedTraining ? (
                            <div className="space-y-8">
                                <AddTrainingActivityItem
                                    selectedTraining={selectedTraining}
                                    exerciseSets={exerciseSets}
                                    trainingExercises={trainingExercises}
                                    setExerciseSets={setExerciseSets}
                                />

                                {setsErrors && (
                                    <p className="pl-1 text-xs text-red-500">{setsErrors}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Выберите тренировку, чтобы заполнить подходы по упражнениям.
                            </p>
                        )}

                        <LightGreenSubmitBtn
                            label={!isSubmitting ? "Сохранить активность" : 'Сохранение...' }
                            disabled={isSubmitting}
                            className="py-2.5"
                        />
                    </form>
                </section>

                <aside className="relative self-start overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl dark:border-neutral-700 sm:p-8">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
                    <div className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="space-y-7">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                                <SparklesIcon className="h-4 w-4" />
                                Трекер активности
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                    Фиксируйте активность и анализируйте прогресс
                                </h2>

                                <p className="max-w-md text-sm text-emerald-50/95 sm:text-base">
                                    Чем точнее заполнены подходы, тем проще сравнивать результативность от тренировки к тренировке
                                </p>
                            </div>

                            <div className="grid gap-5">
                                <HalfContentRow
                                    title={`Быстрый старт`}
                                    text={`Выберите готовую тренировку и заполните только фактические подходы`}
                                    IconComponent={ClipboardDocumentCheckIcon}
                                />

                                <HalfContentRow
                                    title={`Понятная аналитика`}
                                    text={`Тип и сложность активности дают более точную картину нагрузки`}
                                    IconComponent={ChartBarSquareIcon}
                                />

                                <HalfContentRow
                                    title={`Текущий контекст`}
                                    text={selectedTraining ? `Выбрано упражнений: ${selectedTraining.exercises.length}` : 'Тренировка пока не выбрана'}
                                    IconComponent={SparklesIcon}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-sm text-emerald-50/95">
                                <FireIcon className="h-5 w-5 shrink-0" />
                                <span>Регулярные записи активности помогают быстрее видеть результат и прогресс</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}