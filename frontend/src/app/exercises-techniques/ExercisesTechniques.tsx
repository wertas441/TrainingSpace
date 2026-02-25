'use client'

import ExercisesTechniquesHeader from "@/components/UI/headers/ExercisesTechniquesHeader";
import {memo, useEffect, useMemo} from "react";
import ExerciseRow from "@/components/elements/ExerciseRow";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/other/MainPagination";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import NullElementsError from "@/components/errors/NullElementsError";
import {useExerciseStore} from "@/lib/store/exerciseStore";

function ExercisesTechniques({exercises}:{exercises: ExerciseTechniqueItem[]}) {

    const searchName = useExerciseStore(s => s.searchName)
    const difficultFilter = useExerciseStore(s => s.difficultFilter)
    const partOfBodyFilter = useExerciseStore(s => s.partOfBodyFilter)

    const itemsPerPage:number = 10;

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, difficultFilter, partOfBodyFilter, setCurrentPage]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <ExercisesTechniquesHeader exercises={exercises} />

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
                    <NullElementsError text={'Таких упражнений не найдено. попробуйте изменить фильтры и проверить подключение к сети.'} />
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
        </div>
    );
}

export default memo(ExercisesTechniques);