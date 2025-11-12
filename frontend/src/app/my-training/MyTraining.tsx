'use client'

import MainPagination from "@/components/UI/MainPagination";
import MyTrainingHeader from "@/components/UI/headers/MyTrainingHeader";
import {usePagination} from "@/lib/hooks/usePagination";
import {useMemo, useState} from "react";
import {exercises} from "@/lib/data/exercises";
import MyTrainingItem from "@/components/elements/MyTrainingItem";
import {TrainingDataStructure} from "@/types/indexTypes";

export default function MyTraining({trainingList}:{trainingList: TrainingDataStructure[]} ) {

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        return trainingList.filter(e => {
            return q.length === 0 || e.name.toLowerCase().includes(q) ;
        });
    }, [searchName, trainingList]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    return (
        <div className="training">
            <MyTrainingHeader
                searchName={searchName}
                onSearchNameChange={setSearchName}
                ref={listTopRef}
            />

            <div className="grid mt-6 grid-cols-1 gap-3">
                {filteredList.length > 0 ? (
                    paginatedList.map((item) => {
                        // Преобразуем id упражнений в имена; поддержим оба варианта:
                        // 1) id из поля exercises.id (1..N)
                        // 2) индекс массива exercises (0..N-1), если id не найден
                        const exerciseNames: string[] = item.exercises
                            .map((n) => {
                                const byId = exercises.find(ex => ex.id === n);
                                if (byId) return byId.name;
                                // если n — корректный индекс
                                if (n >= 0 && n < exercises.length) {
                                    return exercises[n].name;
                                }
                                return null;
                            })
                            .filter((v): v is string => Boolean(v));

                        return (
                            <MyTrainingItem
                                key={item.id}
                                name={item.name}
                                description={item.description}
                                exercises={exerciseNames}
                            />
                        )
                    })
                ) : (
                    <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                        Такой тренировки не найдено. Попробуйте изменить запрос.
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
        </div>
    )
}