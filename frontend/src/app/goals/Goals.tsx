'use client'

import MainPagination from "@/components/UI/other/MainPagination";
import {usePagination} from "@/lib/hooks/usePagination";
import {memo, useMemo, useState} from "react";
import GoalsHeader from "@/components/UI/headers/GoalsHeader";
import {GoalsStructure} from "@/types/goal";
import GoalItem from "@/components/elements/GoalRow";
import NullElementsError from "@/components/errors/NullElementsError";

interface IProps {
    clientGoals: GoalsStructure[],
    token: string;
}

function Goals({clientGoals, token}: IProps) {

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
                label={'Цели'}
                searchName={searchName}
                setSearchName={setSearchName}
            />

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
                        clientGoals.length === 0
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
        </div>
    )
}

export default memo(Goals);