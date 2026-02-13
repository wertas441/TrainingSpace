'use client'

import {TrainingListResponse} from "@/types/training";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import {useCallback, useEffect, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainMultiSelect from "@/components/inputs/MainMultiSelect";
import {usePagination} from "@/lib/hooks/usePagination";
import {validateTrainingDescription, validateTrainingExercises, validateTrainingName} from "@/lib/utils/validators/training";
import {api, getServerErrorMessage, showErrorMessage} from "@/lib";
import {BackendApiResponse} from "@/types";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import SelectableExerciseRow from "@/components/elements/SelectableExerciseRow";
import MainPagination from "@/components/UI/other/MainPagination";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import {deleteTraining} from "@/lib/controllers/trainingController";
import {useTrainingUtils} from "@/lib/hooks/useTrainingUtils";
import SelectExerciseUi from "@/components/UI/other/SelectExerciseUi";
import {secondDarkColorTheme} from "@/styles";
import {useForm} from "react-hook-form";

interface IProps {
    trainingInfo: TrainingListResponse,
    token: string,
    exercises: ExerciseTechniqueItem[],
}

interface ChangeTrainingFormValues {
    trainingName: string;
    trainingDescription: string;
}

export default function ChangeTraining({ trainingInfo, token, exercises }: IProps) {

    const {register, handleSubmit, formState: { errors }} = useForm<ChangeTrainingFormValues>({
        defaultValues: {
            trainingName: trainingInfo.name,
            trainingDescription: trainingInfo.description,
        }
    })

    const [exercisesError, setExercisesError] = useState<string | null>(null);
    const itemsPerPage:number = 8;

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow();

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, partOfBodyFilter, setCurrentPage]);

    const validateForm = (): boolean => {
        const exercisesValidationError = validateTrainingExercises(selectedExerciseIds);
        setExercisesError(exercisesValidationError);

        return !(exercisesValidationError);
    }

    const onSubmit = async (values: ChangeTrainingFormValues)=> {
        setServerError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            trainingId: trainingInfo.publicId,
            name: values.trainingName,
            description: values.trainingDescription,
            exercises: selectedExerciseIds,
        }

        try {
            await api.put<BackendApiResponse>('/training/training', payload)

            router.replace("/my-training");
        } catch (err) {
            const message:string = getServerErrorMessage(err);

            setServerError(message);
            if (showErrorMessage) console.error('change training error:', err);

            setIsSubmitting(false);
        }
    }

    const deleteTrainingBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteTraining(token, trainingInfo.publicId);

            router.replace("/my-training");
        } catch (error) {
            console.error("delete training error:", error);

            setServerError("Не удалось удалить тренировку. Попробуйте ещё раз позже.");
        }
    }, [trainingInfo, router, setServerError, token]);

    return (
        <>
            <main className="flex items-center justify-center min-h-screen p-4">
                <div className={`${secondDarkColorTheme} w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                    <div className="space-y-6" >
                        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                            Изменение тренировки
                        </h2>

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

                            <SelectExerciseUi
                                selectedExerciseIds={selectedExerciseIds}
                                exercisesError={exercisesError}
                                exercises={exercises}
                                handleToggleExercise={handleToggleExercise}
                            />

                            <div className="mt-10 flex-row md:flex space-y-4 md:space-y-0 items-center gap-x-8">
                                <LightGreenSubmitBtn
                                    label={!isSubmitting ? 'Изменить' : 'Процесс...'}
                                    disabled={isSubmitting}
                                />
                                <RedGlassBtn
                                    label = {'Удалить тренировку'}
                                    onClick = {toggleModalWindow}
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
                cancelButtonLabel={'Отмена'}
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Удалить'}
                confirmFunction={deleteTrainingBtn}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}