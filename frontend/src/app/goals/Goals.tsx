'use client'

import MainPagination from "@/components/UI/MainPagination";
import {usePagination} from "@/lib/hooks/usePagination";
import {memo, useMemo, useState} from "react";
import GoalsHeader from "@/components/UI/headers/GoalsHeader";
import {GoalsStructure} from "@/types/goalTypes";
import GoalItem from "@/components/elements/GoalRow";

interface GoalsProps {
    clientGoals: GoalsStructure[],
    token: string;
}

function Goals({clientGoals, token}: GoalsProps) {

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();
        return clientGoals.filter(e => {
            return q.length === 0 || e.name.toLowerCase().includes(q) ;
        });
    }, [searchName, clientGoals]);

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
                searchName={searchName}
                setSearchName={setSearchName}
            />

            <div className="grid grid-cols-1 gap-3">
                {filteredList.length > 0 ? (
                    paginatedList.map(item => (
                        <GoalItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            priority={item.priority}
                            token={token}
                        />
                    ))
                ) : (
                    <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                        {clientGoals.length === 0
                            ? "У вас пока нет активных целей. Нажмите «Добавить цель», чтобы создать первую."
                            : "По заданным параметрам поиска цели не найдены. Попробуйте изменить фильтр."
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

export default memo(Goals);