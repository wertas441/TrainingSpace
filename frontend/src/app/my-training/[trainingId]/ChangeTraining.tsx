'use client'

import {TrainingListResponse} from "@/types/trainingTypes";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useCallback, useEffect, useMemo, useState} from "react";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import MainMultiSelect, {OptionType} from "@/components/inputs/MainMultiSelect";
import {usePagination} from "@/lib/hooks/usePagination";
import {validateTrainingDescription, validateTrainingExercises, validateTrainingName} from "@/lib/utils/validators";
import {baseUrlForBackend} from "@/lib";
import {BackendApiResponse} from "@/types/indexTypes";
import ServerError from "@/components/errors/ServerError";
import MainInput from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import SelectableExerciseRow from "@/components/elements/SelectableExerciseRow";
import MainPagination from "@/components/UI/MainPagination";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import ModalWindow from "@/components/UI/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import {deleteTraining} from "@/lib/controllers/trainingController";

interface ChangeTrainingProps {
    trainingInfo: TrainingListResponse,
    token: string | undefined,
    exercises: ExerciseTechniqueItem[],
}

export default function ChangeTraining({ trainingInfo, token, exercises }: ChangeTrainingProps) {

    const trainingName = useInputField(trainingInfo?.name ?? "");
    const trainingDescription = useInputField(trainingInfo?.description ?? "");
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>(trainingInfo?.exercises ?? []);
    const [exercisesError, setExercisesError] = useState<string | null>(null);
    const [searchName, setSearchName] = useState<string>('');
    const [partOfBodyFilter, setPartOfBodyFilter] = useState<string[]>([]);
    const itemsPerPage:number = 8;

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow();

    const muscleOptions = useMemo(() => {
        const set = new Set<string>();
        exercises.forEach(e => e.partOfTheBody.forEach(p => set.add(p)));
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .map(v => ({ value: v, label: v }));
    }, [exercises]);

    const selectedMuscles: OptionType[] = useMemo(
        () => muscleOptions.filter(o => partOfBodyFilter.includes(o.value)),
        [partOfBodyFilter, muscleOptions]
    );

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        return exercises.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesPart = partOfBodyFilter.length === 0 || e.partOfTheBody.some(p => partOfBodyFilter.includes(p));
            return matchesName && matchesPart;
        });
    }, [searchName, exercises, partOfBodyFilter]);

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
            const result = await fetch(`${baseUrlForBackend}/api/training/update-my-training`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id: trainingInfo.id,
                    name: trainingName.inputState.value,
                    description: trainingDescription.inputState.value,
                    exercises: selectedExerciseIds,
                }),
            });

            if (result.ok) {
                router.replace("/my-training");
                return;
            }

            const data = await result.json() as BackendApiResponse;
            setServerError(data.error || data.message || "Ошибка изменения тренировки. Проверьте правильность введенных данных.");
            setIsSubmitting(false);
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.");
            console.error("Change training error:", error);
            setIsSubmitting(false);
        }
    }

    const handleToggleExercise = (id: number) => {
        setSelectedExerciseIds(prev => {
            if (prev.includes(id)) {
                const next = prev.filter(x => x !== id);
                if (next.length > 0) setExercisesError(null);
                return next;
            }
            const next = [...prev, id];
            if (next.length > 0) setExercisesError(null);
            return next;
        });
    }

    const deleteTrainingBtn = useCallback(async () => {
        setServerError(null);

        try {
            await deleteTraining(token, trainingInfo.id);
            router.replace("/my-training");
        } catch (error) {
            console.error("delete training error:", error);
            setServerError("Не удалось удалить тренировку. Попробуйте ещё раз позже.");
        }
    }, [trainingInfo, router, setServerError, token]);

    return (
        <>
            <main className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                    <div className="space-y-6" >
                        <h2 className="text-2xl font-bold text-center text-gray-900">
                            Изменение тренировки
                        </h2>

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
                                label="Поиск упражнения по группе мышц"
                                onChange={(vals) => setPartOfBodyFilter(vals.map(v => v.value))}
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

                            <div className="mt-2">
                                <div className="text-sm font-medium text-emerald-900 mb-2">
                                    Выбранные упражнения ({selectedExerciseIds.length})
                                </div>
                                {exercisesError && (
                                    <div className="mb-2 text-sm text-rose-600">{exercisesError}</div>
                                )}
                                {selectedExerciseIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedExerciseIds.map(id => {
                                            const ex = exercises.find(e => e.id === id);
                                            if (!ex) return null;
                                            return (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => handleToggleExercise(id)}
                                                    className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs hover:bg-emerald-100"
                                                >
                                                    {ex.name}
                                                    <span className=" rounded-full bg-white/60 px-1.5 py-1 text-xs border border-emerald-200">убрать</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        Пока ничего не выбрано — добавьте упражнения из списка выше
                                    </div>
                                )}
                            </div>

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