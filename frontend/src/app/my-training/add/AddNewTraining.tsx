'use client'

import {useInputField} from "@/lib/hooks/useInputField";
import {FormEvent, useEffect, useMemo, useState} from "react";
import ServerError from "@/components/errors/ServerError";
import {MainInput} from "@/components/inputs/MainInput";
import MainTextarea from "@/components/inputs/MainTextarea";
import LightGreenSubmitBtn from "@/components/buttons/LightGreenBtn/LightGreenSubmitBtn";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {baseUrlForBackend} from "@/lib";
import MainMultiSelect, {OptionType} from "@/components/inputs/MainMultiSelect";
import {exercises} from "@/lib/data/exercises";
import {usePagination} from "@/lib/hooks/usePagination";
import SelectableExerciseRow from "@/components/elements/SelectableExerciseRow";
import {
    validateTrainingDescription,
    validateTrainingExercises,
    validateTrainingName
} from "@/lib/utils/validators";
import MainPagination from "@/components/UI/MainPagination";

export default function AddNewTraining(){

    const trainingName = useInputField("");
    const trainingDescription = useInputField("");
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
    const [exercisesError, setExercisesError] = useState<string | null>(null);
    const [searchName, setSearchName] = useState<string>('');
    const [partOfBodyFilter, setPartOfBodyFilter] = useState<string[]>([]);
    const itemsPerPage:number = 8;
    const today = new Date().toLocaleDateString();

    const {serverError, setServerError, isSubmitting, setIsSubmitting, router} = usePageUtils();

    const muscleOptions = useMemo(() => {
        const set = new Set<string>();
        exercises.forEach(e => e.partOfTheBody.forEach(p => set.add(p)));
        return Array.from(set)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .map(v => ({ value: v, label: v }));
    }, []);

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
    }, [searchName, partOfBodyFilter]);

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

        const payload = {
            trainingName: trainingName.inputState.value,
            trainingDescription: trainingDescription.inputState.value,
            exercises: selectedExerciseIds,
            date: today,
        }

        console.log(payload);

        try {
            const result = await fetch(`${baseUrlForBackend}/api/training/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                router.replace("/my-training");
                return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setServerError(result.message || "Не удалось добавить тренировку. Проверьте корректность данных.");
        } catch (error) {
            setServerError("Не удалось связаться с сервером. Проверьте интернет-соединение или попробуйте позже.");
            console.error("Add new training error:", error);
            setIsSubmitting(false);
        } finally {
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

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                <div className="space-y-6" >
                    <div>
                        <h2 className="text-2xl pb-2 font-bold text-center text-gray-900">
                            Добавить новую тренировку
                        </h2>
                        <p className="text-center text-gray-600">
                            Заполните данные для отслеживания
                        </p>
                    </div>

                    <ServerError message={serverError} />

                    <form className="space-y-6"  onSubmit={handleSubmit}>

                        <MainInput
                            id={'trainingName'}
                            value={trainingName.inputState.value}
                            onChange={trainingName.setValue}
                            placeholder={'Придумайте имя для тренировки'}
                            error={trainingName.inputState.error || undefined}
                        />

                        <MainTextarea
                            id={'trainingDescription'}
                            value={trainingDescription.inputState.value}
                            onChange={trainingDescription.setValue}
                            placeholder={'Описание тренировки (необязательно)'}
                            error={trainingDescription.inputState.error || undefined}
                            rows={4}
                        />

                        <div className="w-full" ref={listTopRef}>
                            <MainInput
                                id="exercise-search"
                                value={searchName}
                                onChange={(v) => setSearchName(String(v))}
                                placeholder="Поиск упражнения по имени..."
                            />
                        </div>

                        <MainMultiSelect
                            id="muscle-groups"
                            options={muscleOptions}
                            value={selectedMuscles}
                            onChange={(vals) => setPartOfBodyFilter(vals.map(v => v.value))}
                            placeholder="Поиск упражнения по группе мышц..."
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

                        <LightGreenSubmitBtn
                            label={!isSubmitting ? 'Добавить' : 'Добавление...'}
                            disabled={isSubmitting}
                        />
                    </form>
                </div>
            </div>
        </main>
    )
}