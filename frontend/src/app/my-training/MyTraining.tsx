'use client'

import MainPagination from "@/components/UI/other/MainPagination";
import MyTrainingHeader from "@/components/UI/headers/MyTrainingHeader";
import {usePagination} from "@/lib/hooks/usePagination";
import {useEffect, useMemo, useState} from "react";
import MyTrainingRow from "@/components/elements/MyTrainingRow";
import NullElementsError from "@/components/errors/NullElementsError";
import {useTrainings} from "@/lib/hooks/data/training";
import {useExerciseList} from "@/lib/hooks/data/exercise";
import Spinner from "@/components/UI/other/Spinner";
import ErrorState from "@/components/errors/ErrorState";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";

export default function MyTraining({token}: {token: string}) {

    const { trainings, isLoading, error, isError, refetch, isFetching } = useTrainings(token);
    const { exercises } = useExerciseList();

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

    const trainingList = useMemo(() => trainings ?? [], [trainings]);
    const exercisesList = useMemo(() => exercises ?? [], [exercises]);

    const exerciseNameById = useMemo(() => {
        const map = new Map<number, string>();

        for (const ex of exercisesList) {
            map.set(ex.id, ex.name);
        }

        return map;
    }, [exercisesList]);

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

    useEffect(() => setCurrentPage(1), [searchName, setCurrentPage]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <MyTrainingHeader
                searchName={searchName}
                setSearchName={setSearchName}
            />

            {isLoading && trainingList.length === 0 && (
                <div className="rounded-lg border border-emerald-100 p-6">
                    <Spinner label="Загрузка списка тренировок..." size="lg" />
                </div>
            )}

            {isError && (
                <div className="space-y-3 flex flex-col items-center">
                    <ErrorState
                        fullHeight={false}
                        title="Не удалось загрузить список трениовок"
                        description={error instanceof Error ? error.message : "Проверьте подключение к интернету или попробуйте ещё раз."}
                    />

                    <div className="w-full max-w-md">
                        <LightGreenGlassBtn label="Повторить загрузку" onClick={() => refetch()} />
                    </div>
                </div>
            )}


            {!isLoading && !isError && (
                <>
                    {isFetching && trainingList.length > 0 && (
                        <Spinner className="justify-start" size="sm" label="Обновляем список тренировок..." />
                    )}

                    <div className="grid mt-6 grid-cols-1 gap-3">
                        {filteredList.length > 0 ? (
                            paginatedList.map((item) => {
                                const exerciseNames: string[] = item.exercises.map((n) => {
                                    const byId = exerciseNameById.get(n);
                                    if (byId) return byId;
                                }).filter((v): v is string => Boolean(v));

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
                </>
            )}
        </div>
    )
}