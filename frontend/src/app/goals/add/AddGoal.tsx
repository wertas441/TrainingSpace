'use client'

import {GoalFormValues, GoalPriority} from "@/types/goal";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ChipRadioGroup from "@/components/inputs/ChipRadioGroup";
import MainTextarea from "@/components/inputs/MainTextarea";
import {showErrorMessage} from "@/lib";
import {
    ChartBarSquareIcon,
    ClipboardDocumentCheckIcon,
    FireIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import {
    validateGoalDescription,
    validateGoalName,
} from "@/lib/utils/validators/goal";
import {Controller, useForm} from "react-hook-form";
import HalfContentRow from "@/components/elements/HalfContentRow";
import {useCreateGoalMutation} from "@/lib/hooks/mutations/goal";

const goalPriorityOptions: GoalPriority[] = ['Низкий', 'Средний', 'Высокий'] as const;

export default function AddGoal() {

    const {register, handleSubmit, control, formState: { errors }} = useForm<GoalFormValues>({
        defaultValues: {
            goalPriority: 'Средний',
        }
    })

    const { serverError, setServerError, router } = usePageUtils()
    const createGoalMutation = useCreateGoalMutation();

    const onSubmit = (values: GoalFormValues)=> {
        setServerError(null);

        const payload = {
            name: values.goalName,
            description: values.goalDescription,
            priority: values.goalPriority,
        }

        createGoalMutation.mutate(payload, {
            onSuccess: () => router.push("/goals"),

            onError: (err) => {
                const message = err instanceof Error ? err.message : "Не удалось добавить цель. Попробуйте ещё раз.";

                setServerError(message);
                if (showErrorMessage) console.error('add goal error:', err);
            },
        });
    }

    return (
        <main className="min-h-view px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[0.95fr_1.15fr] xl:gap-8">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 sm:p-8">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                    <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                Добавить цель
                            </h1>

                            <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                                Добавьте цель в свой список и стремитесь ее выполнить
                            </p>
                        </div>

                        <ServerError message={serverError} />

                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <MainInput
                                id={'goalName'}
                                label={'Название цели'}
                                placeholder={'Пожать 100кг'}
                                error={errors.goalName?.message}
                                {...register('goalName', {validate: (value) => validateGoalName(value) || true})}
                            />

                            <MainTextarea
                                id="goalDescription"
                                label="Описание"
                                placeholder="Опционально: описание для цели"
                                error={errors.goalDescription?.message}
                                {...register('goalDescription', {validate: (value) => validateGoalDescription(value) || true})}
                            />

                                <Controller
                                    control={control}
                                    name="goalPriority"
                                    render={({field}) => (
                                        <ChipRadioGroup<GoalPriority>
                                            id="goalPriority"
                                            label={`Приоритет цели`}
                                            choices={goalPriorityOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />

                            <LightGreenSubmitBtn
                                label={!createGoalMutation.isPending ? 'Добавить' : 'Добавляем...'}
                                disabled={createGoalMutation.isPending}
                                className={'mt-10 py-2.5'}
                            />
                        </form>
                    </div>
                </section>

                <aside className="relative self-start overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl dark:border-neutral-700 sm:p-8">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
                    <div className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="space-y-7">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                                <SparklesIcon className="h-4 w-4" />
                                Фокус на реальном прогрессе
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                    Добавьте цель и зафиксируйте следующий шаг к результату
                                </h2>

                                <p className="max-w-md text-sm text-emerald-50/95 sm:text-base">
                                    Чем конкретнее цель, тем проще ее выполнять. Заполните форму и сразу получите понятный ориентир.
                                </p>
                            </div>

                            <div className="grid gap-5">
                                <HalfContentRow
                                    title={`Конкретная формулировка`}
                                    text={`Название и описание делают цель измеримой и понятной в ежедневной работе`}
                                    IconComponent={ClipboardDocumentCheckIcon}
                                />

                                <HalfContentRow
                                    title={`Осознанный приоритет`}
                                    text={`Приоритет подсказывает, где держать максимум внимания уже сегодня`}
                                    IconComponent={ChartBarSquareIcon}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-sm text-emerald-50/95">
                                <FireIcon className="h-5 w-5 shrink-0" />
                                <span>Одна четкая цель сегодня - заметный прогресс через неделю.</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}