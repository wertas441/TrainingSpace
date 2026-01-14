'use client'

import {useEffect, useState} from "react";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import {usePagination} from "@/lib/hooks/usePagination";
import SelectableExerciseRow from "@/components/elements/SelectableExerciseRow";
import {
    validateTrainingDescription,
    validateTrainingExercises,
    validateTrainingName
} from "@/lib/utils/validators";
import MainPagination from "@/components/UI/other/MainPagination";
import type {BackendApiResponse} from "@/types/indexTypes";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {useTrainingUtils} from "@/lib/hooks/useTrainingUtils";
import SelectExerciseUi from "@/components/UI/other/SelectExerciseUi";
import NullElementsError from "@/components/errors/NullElementsError";
import {secondDarkColorTheme} from "@/styles";
import {useForm} from "react-hook-form";

interface AddNewTrainingFormValues {
    trainingName: string;
    trainingDescription: string;
}

export default function AddNewTraining({exercises}:{exercises: ExerciseTechniqueItem[]}){

    const {register, handleSubmit, formState: { errors }} = useForm<AddNewTrainingFormValues>({
        defaultValues: {
            trainingName: '',
            trainingDescription: '',
        }
    })

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
            requestData: {
                name: values.trainingName,
                description: values.trainingDescription,
                exercises: selectedExerciseIds,
            }
        }

        try {
            await api.post<BackendApiResponse>('/training/training', payload)

            router.push("/my-training");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('add new training error:', err);

            setIsSubmitting(false);
        }
    }

    return (
        <main className={`flex items-center justify-center min-h-screen p-4`}>
            <div className={`${secondDarkColorTheme} w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                <div className="space-y-6" >
                    <div>
                        <h2 className="text-2xl pb-2 font-semibold text-center text-gray-900 dark:text-white">
                            Добавить новую тренировку
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            Заполните данные для отслеживания
                        </p>
                    </div>

                    <ServerError message={serverError} />

                    <form className="space-y-5"  onSubmit={handleSubmit(onSubmit)}>

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

                        <div ref={listTopRef} className=""></div>

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
                            <MainPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                setCurrentPage={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                            />
                        )}

                        <SelectExerciseUi
                            selectedExerciseIds={selectedExerciseIds}
                            exercisesError={exercisesError}
                            exercises={exercises}
                            handleToggleExercise={handleToggleExercise}
                        />

                        <LightGreenSubmitBtn
                            label={!isSubmitting ? 'Добавить тренировку' : 'Добавление...'}
                            disabled={isSubmitting}
                        />
                    </form>
                </div>
            </div>
        </main>
    )
}