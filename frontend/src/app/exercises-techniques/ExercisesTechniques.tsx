'use client'

import ExercisesTechniquesHeader from "@/entities/exercise/UI/ExercisesTechniquesHeader";
import {useEffect, useMemo} from "react";
import ExerciseRow from "@/shared/UI-kit/elements/ExerciseRow";
import {usePagination} from "@/shared/hooks/usePagination";
import NullElementsError from "@/shared/UI-kit/errors/NullElementsError";
import {useExerciseStore} from "@/entities/exercise/model/store";
import {useExerciseList} from "@/entities/exercise/model/data";
import ErrorState from "@/shared/UI-kit/errors/ErrorState";
import LightGreenGlassBtn from "@/shared/UI-kit/buttons/LightGreenGlassBtn";
import MainPagination from "@/widgets/MainPagination";
import Spinner from "@/widgets/Spinner";

export default function ExercisesTechniques() {

    const { data, isLoading, isError, error, refetch, isFetching } = useExerciseList();

    const searchName = useExerciseStore(s => s.searchName)
    const difficultFilter = useExerciseStore(s => s.difficultFilter)
    const partOfBodyFilter = useExerciseStore(s => s.partOfBodyFilter)

    const itemsPerPage:number = 10;
    const exercises = useMemo(() => data ?? [], [data]);

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return exercises.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);

            const matchesDifficulty = difficultFilter === null || e.difficulty === difficultFilter;

            const matchesPart = partOfBodyFilter.length === 0 || e.partOfTheBody.some(p => partOfBodyFilter.includes(p));

            return matchesName && matchesDifficulty && matchesPart;
        });
    }, [searchName, exercises, difficultFilter, partOfBodyFilter]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => setCurrentPage(1), [searchName, difficultFilter, partOfBodyFilter, setCurrentPage]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <ExercisesTechniquesHeader exercises={exercises} />

            {isLoading && exercises.length === 0 && (
                <div className="rounded-lg border border-emerald-100 p-6">
                    <Spinner label="Загрузка списка упражнений..." size="lg" />
                </div>
            )}

            {isError && (
                <div className="space-y-3 flex flex-col items-center">
                    <ErrorState
                        fullHeight={false}
                        title="Не удалось загрузить список упражнений"
                        description={error instanceof Error ? error.message : "Проверьте подключение к интернету или попробуйте ещё раз."}
                    />

                    <div className="w-full max-w-md">
                        <LightGreenGlassBtn label="Повторить загрузку" onClick={() => refetch()} />
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {isFetching && exercises.length > 0 && (
                        <Spinner className="justify-start" size="sm" label="Обновляем список упражнений..." />
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {filteredList.length > 0 ? (
                            paginatedList.map(ex => (
                                    <ExerciseRow
                                        key={ex.id}
                                        id={ex.id}
                                        name={ex.name}
                                        difficulty={ex.difficulty}
                                        description={ex.description}
                                        partOfTheBody={ex.partOfTheBody}
                                    />
                                )
                            )
                        ) : (
                            <NullElementsError text={'Таких упражнений не найдено. Попробуйте изменить фильтры или проверить подключение к сети.'} />
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
                </>
            )}
        </div>
    );
}
