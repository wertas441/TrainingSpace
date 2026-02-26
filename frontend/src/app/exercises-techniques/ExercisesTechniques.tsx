'use client'

import ExercisesTechniquesHeader from "@/components/UI/headers/ExercisesTechniquesHeader";
import {memo, useEffect, useMemo} from "react";
import ExerciseRow from "@/components/elements/ExerciseRow";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/other/MainPagination";
import NullElementsError from "@/components/errors/NullElementsError";
import {useExerciseStore} from "@/lib/store/exerciseStore";
import {useExerciseList} from "@/lib/hooks/data/exercise";
import ErrorState from "@/components/errors/ErrorState";
import Spinner from "@/components/UI/other/Spinner";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";

function ExercisesTechniques() {

    const {
        exercises,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useExerciseList();

    const searchName = useExerciseStore(s => s.searchName)
    const difficultFilter = useExerciseStore(s => s.difficultFilter)
    const partOfBodyFilter = useExerciseStore(s => s.partOfBodyFilter)

    const itemsPerPage:number = 10;
    const sourceExercises = exercises ?? [];

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return sourceExercises.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);

            const matchesDifficulty = difficultFilter === null || e.difficulty === difficultFilter;

            const matchesPart = partOfBodyFilter.length === 0 || e.partOfTheBody.some(p => partOfBodyFilter.includes(p));

            return matchesName && matchesDifficulty && matchesPart;
        });
    }, [searchName, sourceExercises, difficultFilter, partOfBodyFilter]);

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
    }, [searchName, difficultFilter, partOfBodyFilter, setCurrentPage]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <ExercisesTechniquesHeader exercises={sourceExercises} />

            {isLoading && sourceExercises.length === 0 && (
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
                    {isFetching && sourceExercises.length > 0 && (
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

export default memo(ExercisesTechniques);