'use client'

import ExercisesTechniquesHeader from "@/components/UI/headers/ExercisesTechniquesHeader";
import {memo, useCallback, useEffect, useMemo, useState} from "react";
import ExerciseRow from "@/components/elements/ExerciseRow";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/other/MainPagination";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import {ExerciseDifficultFilter} from "@/types";
import NullElementsError from "@/components/errors/NullElementsError";

function ExercisesTechniques({exercises}:{exercises: ExerciseTechniqueItem[]}) {

    const [searchName, setSearchName] = useState<string>('');
    const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false);
    const [difficultFilter, setDifficultFilter] = useState<ExerciseDifficultFilter>(null);
    const [partOfBodyFilter, setPartOfBodyFilter] = useState<string[]>([]);
    const itemsPerPage:number = 10;

    const toggleFilterWindow = useCallback(() => {
        setIsFilterWindowOpen(!isFilterWindowOpen);
    }, [isFilterWindowOpen]);

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
            <ExercisesTechniquesHeader
                searchName={searchName}
                setSearchName={setSearchName}
                isFilterWindowOpen={isFilterWindowOpen}
                toggleFilterWindow={toggleFilterWindow}
                difficultFilter={difficultFilter}
                setDifficultFilter={setDifficultFilter}
                partOfBodyFilter={partOfBodyFilter}
                setPartOfBodyFilter={setPartOfBodyFilter}
                exercises={exercises}
            />
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