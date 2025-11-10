'use client'

import ExercisesTechniquesHeader from "@/components/UI/headers/ExercisesTechniquesHeader";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {exercises} from "@/lib/data/exercises";
import ExerciseRow from "@/components/elements/ExerciseRow";
import {DifficultOptionsStructure} from "@/types/indexTypes";

export default function ExercisesTechniques() {

    const [searchName, setSearchName] = useState<string>('');
    const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false);
    const [difficultFilter, setDifficultFilter] = useState<DifficultOptionsStructure>(null);
    const [partOfBodyFilter, setPartOfBodyFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const listTopRef = useRef<HTMLDivElement | null>(null);

    const itemsPerPage = 10;


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

    // Сбрасываем страницу при изменении фильтров/поиска
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [searchName, difficultFilter, partOfBodyFilter]);

    const totalItems = filteredExercises.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Клэмпим текущую страницу, если фильтры уменьшили кол-во страниц
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(prev => Math.min(prev, totalPages));
    }, [totalPages]);

    const paginatedExercises = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredExercises.slice(start, end);
    }, [filteredExercises, currentPage]);

    // Автоскролл к началу списка при смене страницы
    useEffect(() => {
        if (listTopRef.current) {
            listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

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
                    paginatedExercises.map(ex => (
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

            {/* Управление пагинацией */}
            {totalItems > 0 && (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Десктопные элементы управления (нумерация + назад/вперёд) */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                className={`px-3 py-1 text-sm rounded-md border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Назад
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`h-8 min-w-8 px-4 rounded-md text-sm border ${p === currentPage ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                {totalPages > 7 && (
                                    <span className="px-1 text-sm text-gray-500">…</span>
                                )}
                            </div>
                            <button
                                className={`px-3 py-1 text-sm rounded-md border ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Вперёд
                            </button>
                        </div>

                        <div className="hidden md:flex text-xs text-gray-600">
                            Показано {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
                        </div>
                    </div>

                    <div className="md:hidden space-y-2">
                        <div className="text-center text-xs text-gray-600">
                            Показано {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
                        </div>
                        <div className="flex items-center py-3 justify-center gap-2">
                            <button
                                className={`px-3 py-1 text-sm rounded-md border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Назад
                            </button>
                            <div className="px-3 py-1 bg-white rounded-md border border-emerald-600 text-sm text-emerald-800">
                                {currentPage} / {totalPages}
                            </div>
                            <button
                                className={`px-3 py-1 text-sm rounded-md border ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Вперёд
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}