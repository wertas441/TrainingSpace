'use client'

import {useMemo, useState} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import GoalsHeader from "@/components/UI/headers/GoalsHeader";
import MainPagination from "@/components/UI/other/MainPagination";
import CompleteGoalRow from "@/components/elements/CompleteGoalRow";
import NullElementsError from "@/components/errors/NullElementsError";
import { useCompletedGoals } from "@/lib/hooks/data/goal";
import Spinner from "@/components/UI/other/Spinner";
import ErrorState from "@/components/errors/ErrorState";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";

export default function CompletedGoals({token}: {token: string}){

    const { completedGoals, isLoading, isError, error, refetch, isFetching } = useCompletedGoals(token);

    const [searchName, setSearchName] = useState<string>('');

    const itemsPerPage:number = 10;

    const sourceGoals = completedGoals ?? [];

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return sourceGoals.filter(e => {
            return q.length === 0 || e.name.toLowerCase().includes(q) ;
        });
    }, [searchName, sourceGoals]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    return (
        <div className="space-y-4" ref={listTopRef} >
            <GoalsHeader
                label={'Выполненные цели'}
                searchName={searchName}
                setSearchName={setSearchName}
            />

            {isLoading && sourceGoals.length === 0 && (
                <div className="rounded-lg border border-emerald-100 p-6">
                    <Spinner label="Загрузка списка выполенных целей..." size="lg" />
                </div>
            )}

            {isError && (
                <div className="space-y-3 flex flex-col items-center">
                    <ErrorState
                        fullHeight={false}
                        title="Не удалось загрузить список выполненных целей"
                        description={error instanceof Error ? error.message : "Проверьте подключение к интернету или попробуйте ещё раз."}
                    />

                    <div className="w-full max-w-md">
                        <LightGreenGlassBtn label="Повторить загрузку" onClick={() => refetch()} />
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {isFetching && sourceGoals.length > 0 && (
                        <Spinner className="justify-start" size="sm" label="Обновляем список выполненных целей..." />
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {filteredList.length > 0 ? (
                            paginatedList.map(item => (
                                <CompleteGoalRow
                                    key={item.id}
                                    name={item.name}
                                    description={item.description}
                                    achieve_at={item.achieve_at}
                                />
                            ))
                        ) : (
                            <NullElementsError text={
                                sourceGoals.length === 0
                                    ? "У вас пока нет выполненных целей. Нажмите «Завершить цель», чтобы завершить первую."
                                    : "По заданным параметрам поиска выполненные цели не найдены. Попробуйте изменить фильтр."
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