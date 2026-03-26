'use client'

import {TrainingForm, TrainingListResponse} from "@/entities/training/model/type";
import type {ExerciseTechniqueItem} from "@/entities/exercise/model/type";
import {useCallback, useEffect, useState} from "react";
import {usePageUtils} from "@/shared/hooks/usePageUtils";
import MainMultiSelect from "@/shared/UI-kit/inputs/MainMultiSelect";
import {usePagination} from "@/shared/hooks/usePagination";
import {validateTrainingDescription, validateTrainingExercises, validateTrainingName} from "@/entities/training/model/validation";
import {showErrorMessage} from "@/shared";
import ServerError from "@/shared/UI-kit/errors/ServerError";
import MainInput from "@/shared/UI-kit/inputs/MainInput";
import MainTextarea from "@/shared/UI-kit/inputs/MainTextarea";
import SelectableExerciseRow from "@/entities/training/UI/SelectableExerciseRow";
import RedGlassBtn from "@/shared/UI-kit/buttons/RedGlassBtn";
import {useModalWindow} from "@/shared/hooks/useModalWindow";
import {useTrainingUtils} from "@/entities/training/useTrainingUtils";
import {secondDarkColorTheme} from "@/shared/styles";
import {useForm} from "react-hook-form";
import DropDownContent from "@/widgets/UiContex/DropDownContent";
import {useDeleteTrainingMutation, useUpdateTrainingMutation} from "@/entities/training/model/mutation";
import LightGreenBtn from "@/shared/UI-kit/buttons/LightGreenBtn";
import ModalWindow from "@/widgets/ModalWindow";
import MainPagination from "@/widgets/MainPagination";
import SelectExerciseUi from "@/widgets/SelectExerciseUi";

interface IProps {
    trainingInfo: TrainingListResponse,
    token: string,
    exercises: ExerciseTechniqueItem[],
}

export default function ChangeTraining({ trainingInfo, token, exercises }: IProps) {

    const {register, handleSubmit, formState: { errors }} = useForm<TrainingForm>({
        defaultValues: {
            name: trainingInfo.name,
            description: trainingInfo.description,
        }
    })

    const { serverError, setServerError, isSubmitting, router } = usePageUtils();

    const { isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef } = useModalWindow();

    const updateTrainingMutation = useUpdateTrainingMutation();
    const deleteTrainingMutation = useDeleteTrainingMutation();

    const [exercisesError, setExercisesError] = useState<string | null>(null);
    const itemsPerPage:number = 8;

    const initialSelectedExerciseIds = trainingInfo.exercises;

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
    } = useTrainingUtils({exercises, setExercisesError, initialSelectedExerciseIds})

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => setCurrentPage(1), [searchName, partOfBodyFilter, setCurrentPage]);

    const validateForm = (): boolean => {
        const exercisesValidationError = validateTrainingExercises(selectedExerciseIds);
        setExercisesError(exercisesValidationError);

        return !(exercisesValidationError);
    }

    const onSubmit = (values: TrainingForm)=> {
        setServerError(null);

        if (!validateForm()) return;

        const payload = {
            trainingId: trainingInfo.publicId,
            name: values.name,
            description: values.description,
            exercises: selectedExerciseIds,
        }

        updateTrainingMutation.mutate(payload, {
            onSuccess: () => router.replace("/my-training"),

            onError: (err: unknown) => {
                const message = err instanceof Error ? err.message : "Не удалось изменить тренировку. Попробуйте ещё раз.";

                setServerError(message);
                if (showErrorMessage) console.error('change training error:', err);
            },
        });
    }

    const deleteTrainingBtn = useCallback(async () => {
        setServerError(null);

        const payload = {
            tokenValue: token,
            trainingId: trainingInfo.publicId,
        }

        deleteTrainingMutation.mutate(payload, {
            onSuccess: () => router.replace("/my-training"),

            onError: (err: unknown) => {
                console.error("delete training error:", err);

                setServerError("Не удалось удалить тренировку. Попробуйте ещё раз позже.");
            },
        });

    }, [trainingInfo.publicId, router, setServerError, token, deleteTrainingMutation]);

    return (
        <>
            <main className="flex items-center justify-center min-h-full p-4">
                <div className={`${secondDarkColorTheme} w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                    <div className="space-y-6" >
                        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                            Изменение тренировки
                        </h2>

                        <ServerError message={serverError} />

                        <form className="space-y-5"  onSubmit={handleSubmit(onSubmit)}>

                            <DropDownContent label={`Основная информация`} defaultOpen={true}>
                                <MainInput
                                    id={'name'}
                                    label={`Название тренировки`}
                                    placeholder={'Силовая тренировка на грудь'}
                                    error={errors.name?.message}
                                    {...register('name', {validate: (value) => validateTrainingName(value) || true})}
                                />

                                <MainTextarea
                                    id={'description'}
                                    label={'Описание тренировки'}
                                    placeholder="Опционально: описание для тренировки"
                                    error={errors.description?.message}
                                    {...register('description', {validate: (value) => validateTrainingDescription(value) || true})}
                                />
                            </DropDownContent>

                            <div ref={listTopRef} className=""></div>


                            <DropDownContent label={`Упражнения`}>
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
                                    label="Поиск упражнения по группе мышц"
                                    onChange={(vals) => setPartOfBodyFilter(vals.map(v => v.value))}
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
                            </DropDownContent>

                            <SelectExerciseUi
                                selectedExerciseIds={selectedExerciseIds}
                                exercisesError={exercisesError}
                                exercises={exercises}
                                handleToggleExercise={handleToggleExercise}
                            />

                            <div className="mt-10 flex-row md:flex space-y-4 md:space-y-0 items-center gap-x-8">
                                <LightGreenBtn
                                    label={!isSubmitting ? 'Изменить' : 'Процесс...'}
                                    type={`submit`}
                                    disabled={isSubmitting}
                                />

                                <RedGlassBtn
                                    label={'Удалить тренировку'}
                                    onClick={toggleModalWindow}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <ModalWindow
                isExiting={isExiting}
                modalRef={windowModalRef}
                windowLabel={'Подтверждение удаления'}
                windowText={`Вы действительно хотите удалить тренировку "${trainingInfo.name}"? Это действие необратимо. `}
                error={serverError}
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteTrainingBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}