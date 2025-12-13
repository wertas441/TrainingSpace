'use client'

import {useMemo, useState} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import GoalsHeader from "@/components/UI/headers/GoalsHeader";
import MainPagination from "@/components/UI/other/MainPagination";
import CompleteGoalRow from "@/components/elements/CompleteGoalRow";
import {CompleteGoalsStructure} from "@/types/goalTypes";

export default function CompletedGoals({completeList}: {completeList: CompleteGoalsStructure[]}){

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        return completeList.filter(e => {
            return q.length === 0 || e.name.toLowerCase().includes(q) ;
        });
    }, [searchName, completeList]);

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
                    <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                        {completeList.length === 0
                            ? "У вас пока нет выполненных целей. Нажмите «Завершить цель», чтобы завершить первую."
                            : "По заданным параметрам поиска выполненные цели не найдены. Попробуйте изменить фильтр."
                        }
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