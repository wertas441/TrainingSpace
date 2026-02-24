'use client'

import {useEffect, useState} from "react";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {serverApi, getServerErrorMessage, showErrorMessage} from "@/lib";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import {usePagination} from "@/lib/hooks/usePagination";
import SelectableExerciseRow from "@/components/elements/SelectableExerciseRow";
import {
    validateTrainingDescription,
    validateTrainingExercises,
    validateTrainingName
} from "@/lib/utils/validators/training";
import MainPagination from "@/components/UI/other/MainPagination";
import type {BackendApiResponse} from "@/types";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import {useTrainingUtils} from "@/lib/hooks/useTrainingUtils";
import SelectExerciseUi from "@/components/UI/other/SelectExerciseUi";
import NullElementsError from "@/components/errors/NullElementsError";
import HalfContentRow from "@/components/elements/HalfContentRow";
import {
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    FireIcon,
    MagnifyingGlassIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import {useForm} from "react-hook-form";
import DropDownContent from "@/components/UI/UiContex/DropDownContent";

interface AddNewTrainingFormValues {
    trainingName: string;
    trainingDescription: string;
}

export default function AddNewTraining({exercises}:{exercises: ExerciseTechniqueItem[]}){

    const { register, handleSubmit, formState: { errors } } = useForm<AddNewTrainingFormValues>()

    const [exercisesError, setExercisesError] = useState<string | null>(null);
    const itemsPerPage:number = 8;

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const {
        partOfBodyFilter,
        setPartOfBodyFilter,
        searchName,
        setSearchName,
        muscleOptions,
        selectedMuscles,
        filteredList,
        handleToggleExercise,
        selectedExerciseIds
    } = useTrainingUtils({exercises, setExercisesError})

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, partOfBodyFilter, setCurrentPage]);

    const validateForm = (): boolean => {
        const exercisesValidationError = validateTrainingExercises(selectedExerciseIds);
        setExercisesError(exercisesValidationError);

        return !(exercisesValidationError);
    }

    const onSubmit = async (values: AddNewTrainingFormValues)=> {
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: values.trainingName,
            description: values.trainingDescription,
            exercises: selectedExerciseIds,
        }

        try {
            await serverApi.post<BackendApiResponse>('/training/training', payload)

            router.push("/my-training");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('add new training error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-view px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-7xl items-start gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:gap-8">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 sm:p-8">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                    <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                                Добавить новую тренировку
                            </h1>

                            <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                                Заполните данные для отслеживания
                            </p>
                        </div>

                        <ServerError message={serverError} />



                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <DropDownContent label={`Основная информация`} defaultOpen={true}>
                                <MainInput
                                    id={'trainingName'}
                                    label={`Название тренировки`}
                                    placeholder={'Силовая тренировка на грудь'}
                                    error={errors.trainingName?.message}
                                    {...register('trainingName', {validate: (value) => validateTrainingName(value) || true})}
                                />

                                <MainTextarea
                                    id={'trainingDescription'}
                                    label={'Описание тренировки'}
                                    placeholder="Опционально: описание для тренировки"
                                    error={errors.trainingDescription?.message}
                                    {...register('trainingDescription', {validate: (value) => validateTrainingDescription(value) || true})}
                                />
                            </DropDownContent>


                            <DropDownContent label={`Упражнения`} >
                                <div
                                    ref={listTopRef}
                                    className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-800/70"
                                >
                                    <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Подбор упражнений
                                    </div>

                                    <div className="space-y-4">
                                        <MainInput
                                            id="exercise-search"
                                            value={searchName}
                                            onChange={(e) => setSearchName(e.target.value)}
                                            label="Поиск упражнения по имени"
                                            error={undefined}
                                        />

                                        <MainMultiSelect
                                            id="muscle-groups"
                                            options={muscleOptions}
                                            value={selectedMuscles}
                                            onChange={(vals) => setPartOfBodyFilter(vals.map(v => v.value))}
                                            label="Поиск упражнения по группе мышц"
                                            placeholder={'Выберите группу мышц...'}
                                            error={undefined}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-800/70">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Список упражнений
                                        </div>

                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Найдено: {totalItems}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredList.length > 0 ? (
                                            paginatedList.map(ex => (
                                                <SelectableExerciseRow
                                                    key={ex.id}
                                                    exercise={ex}
                                                    selected={selectedExerciseIds.includes(ex.id)}
                                                    onToggle={handleToggleExercise}
                                                />
                                            ))
                                        ) : (
                                            <NullElementsError text={`Таких упражнений не найдено. Попробуйте изменить запрос.`} />
                                        )}
                                    </div>

                                    {totalItems > itemsPerPage && (
                                        <div className="mt-4">
                                            <MainPagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                totalItems={totalItems}
                                                setCurrentPage={setCurrentPage}
                                                itemsPerPage={itemsPerPage}
                                            />
                                        </div>
                                    )}
                                </div>
                            </DropDownContent>

                            <SelectExerciseUi
                                selectedExerciseIds={selectedExerciseIds}
                                exercisesError={exercisesError}
                                exercises={exercises}
                                handleToggleExercise={handleToggleExercise}
                            />

                            <LightGreenSubmitBtn
                                label={!isSubmitting ? 'Добавить тренировку' : 'Добавление...'}
                                disabled={isSubmitting}
                                className="py-2.5"
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
                                Шаблон тренировки
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                    Соберите структуру занятия и повторяйте ее в один клик
                                </h2>

                                <p className="max-w-md text-sm text-emerald-50/95 sm:text-base">
                                    Продуманный набор упражнений экономит время и делает прогресс предсказуемым.
                                </p>
                            </div>

                            <div className="grid gap-5">
                                <HalfContentRow
                                    title={`Логичный план`}
                                    text={`Название и описание помогают быстро вспомнить цель тренировки`}
                                    IconComponent={ClipboardDocumentCheckIcon}
                                />

                                <HalfContentRow
                                    title={`Быстрый фильтр`}
                                    text={`Ищите упражнения по имени и группам мышц, чтобы собрать нужный фокус`}
                                    IconComponent={MagnifyingGlassIcon}
                                />

                                <HalfContentRow
                                    title={`Контроль набора`}
                                    text={`Уже выбрано: ${selectedExerciseIds.length} упражнений`}
                                    IconComponent={CheckCircleIcon}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-sm text-emerald-50/95">
                                <FireIcon className="h-5 w-5 shrink-0" />
                                <span>Хороший шаблон делает тренировки стабильными и проще в исполнении.</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}