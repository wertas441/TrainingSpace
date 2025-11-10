'use client'

import ExercisesTechniquesHeader from "@/components/UI/headers/ExercisesTechniquesHeader";
import {useCallback, useEffect, useMemo, useState} from "react";
import {exercises} from "@/lib/data/exercises";
import ExerciseRow from "@/components/elements/ExerciseRow";
import {DifficultOptionsStructure} from "@/types/indexTypes";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/MainPagination";

export default function ExercisesTechniques() {

    const [searchName, setSearchName] = useState<string>('');
    const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false);
    const [difficultFilter, setDifficultFilter] = useState<DifficultOptionsStructure>(null);
    const [partOfBodyFilter, setPartOfBodyFilter] = useState<string[]>([]);
    const itemsPerPage:number = 10;

    const toggleFilterWindow = useCallback(() => {
        setIsFilterWindowOpen(!isFilterWindowOpen);
    }, [isFilterWindowOpen]);

    const filteredExercises = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        return exercises.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesDifficulty = difficultFilter === null || e.difficulty === difficultFilter;
            const matchesPart = partOfBodyFilter.length === 0 || e.partOfTheBody.some(p => partOfBodyFilter.includes(p));
            return matchesName && matchesDifficulty && matchesPart;
        });
    }, [searchName, difficultFilter, partOfBodyFilter]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredExercises, itemsPerPage)

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, difficultFilter, partOfBodyFilter, setCurrentPage]);

    return (
        <div className="space-y-4">
            <ExercisesTechniquesHeader
                ref={listTopRef}
                searchName={searchName}
                onSearchChange={setSearchName}
                isFilterWindowOpen={isFilterWindowOpen}
                toggleFilterWindow={toggleFilterWindow}
                difficultFilter={difficultFilter}
                setDifficultFilter={setDifficultFilter}
                partOfBodyFilter={partOfBodyFilter}
                setPartOfBodyFilter={setPartOfBodyFilter}
            />

            <div className="grid grid-cols-1 gap-3">
                {filteredExercises.length > 0 ? (
                    paginatedList.map(ex => (
                            <ExerciseRow
                                key={ex.id}
                                exercise={ex}
                            />
                        )
                    )
                ) : (
                    <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                        Ничего не найдено. Попробуйте изменить запрос.
                    </div>
                )}
            </div>

            {totalItems > 0 && (
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