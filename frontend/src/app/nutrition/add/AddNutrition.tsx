'use client'

import ServerError from "@/components/errors/ServerError";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {serverApi, getServerErrorMessage, showErrorMessage} from "@/lib";
import {
    CalendarDaysIcon,
    ChartBarSquareIcon,
    CheckCircleIcon,
    FireIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import {
    validateCalories,
    validateCarbGrams,
    validateDayDate,
    validateDayName,
    validateFatGrams,
    validateProteinGrams,
    validateDayDescription,
} from "@/lib/utils/validators/nutrition";
import MainTextarea from "@/components/inputs/MainTextarea";
import MainInput from "@/components/inputs/MainInput";
import type {BackendApiResponse} from "@/types";
import {useForm} from "react-hook-form";
import {NutritionFormValues} from "@/types/nutrition";
import HalfContentRow from "@/components/elements/HalfContentRow";

export default function AddNutrition(){

    const today = new Date();
    const initialDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const {register, handleSubmit, formState: { errors }} = useForm<NutritionFormValues>({
        defaultValues: {
            dayDate: initialDate,
        }
    })

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const onSubmit = async (values: NutritionFormValues)=> {
        setServerError(null);
        setIsSubmitting(true);

        const payload = {
            name: values.dayName,
            description: values.dayDescription,
            date: values.dayDate,
            calories: parseInt(values.calories, 10),
            protein: parseInt(values.protein, 10),
            fat: parseInt(values.fat, 10),
            carb: parseInt(values.carb, 10),
        }

        try {
            await serverApi.post<BackendApiResponse>('/nutrition/day', payload)

            router.push("/nutrition");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('add new nutrition day error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-view px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] xl:gap-8">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 sm:p-8">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                    <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                Добавить день питания
                            </h1>

                            <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                                Заполните данные для отслеживания
                            </p>
                        </div>

                        <ServerError message={serverError} />

                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <MainInput
                                id={'dayName'}
                                label={'Наименование дня'}
                                placeholder={'Например: День с упором на белок'}
                                error={errors.dayName?.message}
                                {...register('dayName', {validate: (value) => validateDayName(value) || true})}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <MainInput
                                    id={'calories'}
                                    label={'Калории (ккал)'}
                                    error={errors.calories?.message}
                                    {...register('calories', {validate: (value) => validateCalories(value) || true})}
                                />

                                <MainInput
                                    id={'dayDate'}
                                    type={'date'}
                                    label={'Дата'}
                                    error={errors.dayDate?.message}
                                    {...register('dayDate', {validate: (value) => validateDayDate(value) || true})}
                                />
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-800/70">
                                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Макроэлементы
                                </p>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <MainInput
                                        id={'protein'}
                                        label={'Белки (г)'}
                                        error={errors.protein?.message}
                                        {...register('protein', {validate: (value) => validateProteinGrams(value) || true})}
                                    />

                                    <MainInput
                                        id={'fat'}
                                        label={'Жиры (г)'}
                                        error={errors.fat?.message}
                                        {...register('fat', {validate: (value) => validateFatGrams(value) || true})}
                                    />

                                    <MainInput
                                        id={'carb'}
                                        label={'Углеводы (г)'}
                                        error={errors.carb?.message}
                                        {...register('carb', {validate: (value) => validateCarbGrams(value) || true})}
                                    />
                                </div>
                            </div>

                            <MainTextarea
                                id={'dayDescription'}
                                label={'Описание'}
                                placeholder={`Опционально: комментарий ко дню`}
                                error={errors.dayDescription?.message}
                                {...register('dayDescription', {validate: (value) => validateDayDescription(value) || true})}
                            />

                            <LightGreenSubmitBtn
                                label={!isSubmitting ? 'Добавить' : 'Добавление...'}
                                disabled={isSubmitting}
                                className="mt-2 py-2.5"
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
                                Дневник питания
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                    Подсчёт калорий - лучшее понимание вашего рациона
                                </h2>

                                <p className="max-w-md text-sm text-emerald-50/95 sm:text-base">
                                    Записывайте калории и БЖУ, чтобы видеть реальную картину и корректировать питание осознанно.
                                </p>
                            </div>

                            <div className="grid gap-5">
                                <HalfContentRow
                                    title={`Точность по дате`}
                                    text={`Каждый день фиксируется отдельно - удобно следить за динамикой`}
                                    IconComponent={CalendarDaysIcon}
                                />

                                <HalfContentRow
                                    title={`Контроль баланса БЖУ`}
                                    text={`Смотрите распределение белков, жиров и углеводов, а не только общие калории`}
                                    IconComponent={ChartBarSquareIcon}
                                />

                                <HalfContentRow
                                    title={`Контроль привычки`}
                                    text={`Даже краткие записи каждый день формируют стабильную систему питания`}
                                    IconComponent={SparklesIcon}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-sm text-emerald-50/95">
                                <CheckCircleIcon className="h-5 w-5 shrink-0" />
                                <span>Регулярные записи питания помогают быстрее выйти на нужный результат.</span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-50/95">
                                <FireIcon className="h-5 w-5 shrink-0" />
                                <span>Стабильность важнее идеального дня.</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}