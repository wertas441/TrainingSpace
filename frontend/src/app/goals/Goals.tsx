'use client'

import {usePagination} from "@/shared/hooks/usePagination";
import {useMemo, useState} from "react";
import GoalsHeader from "@/entities/goal/UI/GoalsHeader";
import GoalItem from "@/entities/goal/UI/GoalRow";
import NullElementsError from "@/shared/UI-kit/errors/NullElementsError";
import {useGoals} from "@/entities/goal/model/data";
import ErrorState from "@/shared/UI-kit/errors/ErrorState";
import LightGreenGlassBtn from "@/shared/UI-kit/buttons/LightGreenGlassBtn";
import Spinner from "@/widgets/Spinner";
import MainPagination from "@/widgets/MainPagination";

export default function Goals({token}: {token: string}) {

    const { data, isLoading, error, isError, refetch, isFetching } = useGoals(token)

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

    const goals = useMemo(() => data ?? [], [data]) ;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return goals.filter(e => {
            return q.length === 0 || e.name.toLowerCase().includes(q) ;
        });
    }, [searchName, goals]);

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
                label={'Цели'}
                searchName={searchName}
                setSearchName={setSearchName}
            />

            {isLoading && goals.length === 0 && (
                <div className="rounded-lg border border-emerald-100 p-6">
                    <Spinner label="Загрузка списка целей..." size="lg" />
                </div>
            )}

            {isError && (
                <div className="space-y-3 flex flex-col items-center">
                    <ErrorState
                        fullHeight={false}
                        title="Не удалось загрузить список целей"
                        description={error instanceof Error ? error.message : "Проверьте подключение к интернету или попробуйте ещё раз."}
                    />

                    <div className="w-full max-w-md">
                        <LightGreenGlassBtn label="Повторить загрузку" onClick={() => refetch()} />
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {isFetching && goals.length > 0 && (
                        <Spinner className="justify-start" size="sm" label="Обновляем список целей..." />
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {filteredList.length > 0 ? (
                            paginatedList.map(item => (
                                <GoalItem
                                    key={item.publicId}
                                    id={item.id}
                                    publicId={item.publicId}
                                    name={item.name}
                                    description={item.description}
                                    priority={item.priority}
                                    token={token}
                                />
                            ))
                        ) : (
                            <NullElementsError text={
                                goals.length === 0
                                    ? "У вас пока нет активных целей. Нажмите «Добавить цель», чтобы создать первую."
                                    : "По заданным параметрам поиска цели не найдены. Попробуйте изменить фильтр."
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

