'use client'

import MainPagination from "@/components/UI/other/MainPagination";
import MyTrainingHeader from "@/components/UI/headers/MyTrainingHeader";
import {usePagination} from "@/lib/hooks/usePagination";
import {useEffect, useMemo, useState} from "react";
import MyTrainingRow from "@/components/elements/MyTrainingRow";
import {TrainingDataStructure} from "@/types/indexTypes";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import NullElementsError from "@/components/errors/NullElementsError";

interface MyTrainingProps {
    trainingList: TrainingDataStructure[],
    exercises: ExerciseTechniqueItem[],
}

export default function MyTraining({trainingList, exercises}: MyTrainingProps) {

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

    const exerciseNameById = useMemo(() => {
        const map = new Map<number, string>();
        for (const ex of exercises) {
            map.set(ex.id, ex.name);
        }
        return map;
    }, [exercises]);

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

    // чтобы при фильтрации не оставаться на странице, где элементов уже нет
    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, setCurrentPage]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <MyTrainingHeader
                searchName={searchName}
                setSearchName={setSearchName}
            />

            <div className="grid mt-6 grid-cols-1 gap-3">
                {filteredList.length > 0 ? (
                    paginatedList.map((item) => {
                        // Преобразуем id упражнений в имена; поддержим оба варианта:
                        // 1) id из поля exercises.id (1..N)
                        // 2) индекс массива exercises (0..N-1), если id не найден
                        const exerciseNames: string[] = item.exercises
                            .map((n) => {
                                const byId = exerciseNameById.get(n);
                                if (byId) return byId;
                                // если n — корректный индекс
                                if (n >= 0 && n < exercises.length) {
                                    return exercises[n]?.name ?? null;
                                }
                                return null;
                            })
                            .filter((v): v is string => Boolean(v));

                        return (
                            <MyTrainingRow
                                key={item.id}
                                id={item.id}
                                publicId={item.publicId}
                                name={item.name}
                                description={item.description}
                                exercises={exerciseNames}
                            />
                        )
                    })
                ) : (
                    <NullElementsError text={
                        trainingList.length === 0
                            ? "У вас пока нет созданных тренировок. Нажмите «Создать тренировку», чтобы создать первую."
                            : "По заданным параметрам поиска тренировки не найдены. Попробуйте изменить фильтр."
                    } />
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