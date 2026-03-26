'use client'

import {useEffect, useMemo} from "react";
import {usePagination} from "@/shared/hooks/usePagination";
import MyActivityHeader from "@/entities/activity/UI/MyActivityHeader";
import MyActivityRow from "@/entities/activity/UI/MyActivityRow";
import NullElementsError from "@/shared/UI-kit/errors/NullElementsError";
import {normalizeToYMD} from "@/shared";
import {useActivityStore} from "@/entities/activity/model/store";
import {useActivity} from "@/entities/activity/model/data";
import ErrorState from "@/shared/UI-kit/errors/ErrorState";
import LightGreenGlassBtn from "@/shared/UI-kit/buttons/LightGreenGlassBtn";
import MainPagination from "@/widgets/MainPagination";
import Spinner from "@/widgets/Spinner";

export default function MyActivity({token}:{token: string}) {

    const { data, isLoading, error, isError, refetch, isFetching } = useActivity(token);

    const activity = useMemo(() => data ?? [], [data]);

    const searchName = useActivityStore(s => s.searchName);
    const searchDate = useActivityStore(s => s.searchDate);
    const difficultFilter = useActivityStore(s => s.difficultFilter);
    const typeFilter = useActivityStore(s => s.typeFilter);

    const itemsPerPage:number = 10;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return activity.filter((activity) => {
            const matchesName = q.length === 0 || activity.name.toLowerCase().includes(q);

            const matchesDate = !searchDate || normalizeToYMD(activity.activityDate) === searchDate;

            const matchesDifficulty = difficultFilter === null || activity.difficulty === difficultFilter;

            const matchesType = typeFilter === null || activity.type === typeFilter;

            return matchesName && matchesDate && matchesDifficulty && matchesType;
        });
    }, [searchName, searchDate, difficultFilter, typeFilter, activity]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => setCurrentPage(1), [searchName, searchDate, difficultFilter, typeFilter, setCurrentPage]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <MyActivityHeader />

            {isLoading && activity.length === 0 && (
                <div className="rounded-lg border border-emerald-100 p-6">
                    <Spinner label="Загрузка списка активностей..." size="lg" />
                </div>
            )}

            {isError && (
                <div className="space-y-3 flex flex-col items-center">
                    <ErrorState
                        fullHeight={false}
                        title="Не удалось загрузить список активностей"
                        description={error instanceof Error ? error.message : "Проверьте подключение к интернету или попробуйте ещё раз."}
                    />

                    <div className="w-full max-w-md">
                        <LightGreenGlassBtn label="Повторить загрузку" onClick={() => refetch()} />
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {isFetching && activity.length > 0 && (
                        <Spinner className="justify-start" size="sm" label="Обновляем список активностей..." />
                    )}

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
                                activity.length === 0
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
                </>
            )}
        </div>
    )
}