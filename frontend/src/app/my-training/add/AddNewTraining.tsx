git 'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useEffect, useState} from "react";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {baseUrlForBackend} from "@/lib";
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

export default function AddNewTraining({exercises}:{exercises: ExerciseTechniqueItem[]}){

    const trainingName = useInputField("");
    const trainingDescription = useInputField("");
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
        const trainingNameError = validateTrainingName(trainingName.inputState.value);
        trainingName.setError(trainingNameError);

        const descriptionError = validateTrainingDescription(trainingDescription.inputState.value);
        trainingDescription.setError(descriptionError);

        const exercisesValidationError = validateTrainingExercises(selectedExerciseIds);
        setExercisesError(exercisesValidationError);

        return !(trainingNameError || descriptionError || exercisesValidationError);
    }

    const handleSubmit = async (event: FormEvent):Promise<void> => {
        event.preventDefault();
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/training/add-new-training`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: trainingName.inputState.value,
                    description: trainingDescription.inputState.value,
                    exercises: selectedExerciseIds,
                }),
            });

            if (result.ok) {
                router.push("/my-training");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка добавление тренировки. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Add new training error:", error);
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                <div className="space-y-6" >
                    <div>
                        <h2 className="text-2xl pb-2 font-semibold text-center text-gray-900">
                            Добавить новую тренировку
                        </h2>
                        <p className="text-center text-gray-600">
                            Заполните данные для отслеживания
                        </p>
                    </div>

                    <ServerError message={serverError} />

                    <form className="space-y-5"  onSubmit={handleSubmit}>

                        <MainInput
                            id={'trainingName'}
                            value={trainingName.inputState.value}
                            onChange={trainingName.setValue}
                            label={`Название тренировки`}
                            placeholder={'Силовая тренировка на грудь'}
                            error={trainingName.inputState.error || undefined}
                        />

                        <MainTextarea
                            id={'trainingDescription'}
                            value={trainingDescription.inputState.value}
                            onChange={trainingDescription.setValue}
                            label={'Описание тренировки'}
                            placeholder="Опционально: описание для тренировки"
                            error={trainingDescription.inputState.error || undefined}
                            rows={4}
                        />

                        <div ref={listTopRef} className=""></div>

                        <MainInput
                            id="exercise-search"
                            value={searchName}
                            onChange={(v) => setSearchName(String(v))}
                            label="Поиск упражнения по имени"
                        />

                        <MainMultiSelect
                            id="muscle-groups"
                            options={muscleOptions}
                            value={selectedMuscles}
                            onChange={(vals) => setPartOfBodyFilter(vals.map(v => v.value))}
                            label="Поиск упражнения по группе мышц"
                            placeholder={'Выберите группу мышц...'}
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
                                <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                                    Таких упражнений не найдено. Попробуйте изменить запрос.
                                </div>
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