'use client'

import {ActivityDataStructure, ActivityDifficultyFilter, ActivityTypeFilter} from "@/types/activityTypes";
import {useCallback, useEffect, useMemo, useState} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/other/MainPagination";
import MyActivityHeader from "@/components/UI/headers/MyActivityHeader";
import MyActivityRow from "@/components/elements/MyActivityRow";
import NullElementsError from "@/components/errors/NullElementsError";
import {normalizeToYMD} from "@/lib";

export default function MyActivity({clientActivity}:{clientActivity: ActivityDataStructure[]; }) {

    const [searchName, setSearchName] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');

    const [isFilterWindowOpen, setIsFilterWindowOpen] = useState<boolean>(false);
    const [difficultFilter, setDifficultFilter] = useState<ActivityDifficultyFilter>(null);
    const [typeFilter, setTypeFilter] = useState<ActivityTypeFilter>(null);

    const itemsPerPage:number = 10;

    const toggleFilterWindow = useCallback(() => {
        setIsFilterWindowOpen(!isFilterWindowOpen);
    }, [isFilterWindowOpen]);

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return clientActivity.filter((activity) => {
            const matchesName =
                q.length === 0 || activity.name.toLowerCase().includes(q);

            const matchesDate =
                !searchDate || normalizeToYMD(activity.activityDate) === searchDate;

            const matchesDifficulty =
                difficultFilter === null || activity.difficulty === difficultFilter;

            const matchesType =
                typeFilter === null || activity.type === typeFilter;

            return matchesName && matchesDate && matchesDifficulty && matchesType;
        });
    }, [searchName, searchDate, difficultFilter, typeFilter, clientActivity]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchDate, difficultFilter, typeFilter, setCurrentPage]);


    return (
        <div className="space-y-4" ref={listTopRef} >
            <MyActivityHeader
                searchName={searchName}
                setSearchName={setSearchName}
                searchDate={searchDate}
                setSearchDate={setSearchDate}
                isFilterWindowOpen={isFilterWindowOpen}
                toggleFilterWindow={toggleFilterWindow}
                difficultFilter={difficultFilter}
                setDifficultFilter={setDifficultFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
            />

            <div className="grid mt-6 grid-cols-1 gap-3">
                {filteredList.length > 0 ? (
                    paginatedList.map((item) => (
                        <MyActivityRow
                            key={item.publicId}
                            activity={item}
                        />
                    ))
                ) : (
                    <NullElementsError text={
                        clientActivity.length === 0
                            ? "У вас пока нет добавленной активности. Нажмите «Добавить активность», чтобы добавить первую."
                            : "По заданным параметрам поиска активности не найдены. Попробуйте изменить фильтр."
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