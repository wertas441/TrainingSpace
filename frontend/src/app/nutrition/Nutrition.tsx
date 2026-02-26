'use client'

import NutritionHeader from "@/components/UI/headers/NutritionHeader";
import NutritionDayItem from "@/components/elements/NutritionDayRow";
import {useEffect, useMemo} from "react";
import {usePagination} from "@/lib/hooks/usePagination";
import MainPagination from "@/components/UI/other/MainPagination";
import NullElementsError from "@/components/errors/NullElementsError";
import {normalizeToYMD} from "@/lib";
import {useNutritionStore} from "@/lib/store/nutritionStore";
import {useNutrition} from "@/lib/hooks/data/nutrition";
import Spinner from "@/components/UI/other/Spinner";
import ErrorState from "@/components/errors/ErrorState";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";

export default function Nutrition({token}: {token: string}) {

    const { days, isLoading, error, isError, refetch, isFetching } = useNutrition(token);

    const userDays = useMemo(() => days ?? [], [days]);

    const searchName = useNutritionStore(s => s.searchName);
    const searchDate = useNutritionStore(s => s.searchDate);
    const caloriesMin = useNutritionStore(s => s.caloriesMin);
    const caloriesMax = useNutritionStore(s => s.caloriesMax);
    const proteinMin = useNutritionStore(s => s.proteinMin);
    const proteinMax = useNutritionStore(s => s.proteinMax);
    const fatMin = useNutritionStore(s => s.fatMin);
    const fatMax = useNutritionStore(s => s.fatMax);
    const carbMin = useNutritionStore(s => s.carbMin);
    const carbMax = useNutritionStore(s => s.carbMax);

    const itemsPerPage:number = 10;

    const filteredList = useMemo(() => {
        const q = searchName.toLowerCase().trim();

        return userDays.filter(e => {
            const matchesName = q.length === 0 || e.name.toLowerCase().includes(q);
            const matchesData = searchDate === '' || normalizeToYMD(e.date) === searchDate;
            const byCaloriesMin = caloriesMin === '' || e.calories >= caloriesMin;
            const byCaloriesMax = caloriesMax === '' || e.calories <= caloriesMax;
            const byProteinMin = proteinMin === '' || e.protein >= proteinMin;
            const byProteinMax = proteinMax === '' || e.protein <= proteinMax;
            const byFatMin = fatMin === '' || e.fat >= fatMin;
            const byFatMax = fatMax === '' || e.fat <= fatMax;
            const byCarbMin = carbMin === '' || e.carb >= carbMin;
            const byCarbMax = carbMax === '' || e.carb <= carbMax;

            return matchesName && matchesData && byCaloriesMin && byCaloriesMax && byProteinMin && byProteinMax
                && byFatMin && byFatMax && byCarbMin && byCarbMax;
        });
    }, [searchName, userDays, searchDate, caloriesMin, caloriesMax, proteinMin, proteinMax, fatMin, fatMax, carbMin, carbMax]);

    const {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList,
    } = usePagination(filteredList, itemsPerPage)

    useEffect(() => {setCurrentPage(1);}, [
        searchName, searchDate,
        caloriesMin, caloriesMax,
        proteinMin, proteinMax,
        fatMin, fatMax,
        carbMin, carbMax,
        setCurrentPage
    ]);

    return (
        <div className="space-y-4" ref={listTopRef} >
            <NutritionHeader />

            {isLoading && userDays.length === 0 && (
                <div className="rounded-lg border border-emerald-100 p-6">
                    <Spinner label="Загрузка списка дней..." size="lg" />
                </div>
            )}

            {isError && (
                <div className="space-y-3 flex flex-col items-center">
                    <ErrorState
                        fullHeight={false}
                        title="Не удалось загрузить список дней"
                        description={error instanceof Error ? error.message : "Проверьте подключение к интернету или попробуйте ещё раз."}
                    />

                    <div className="w-full max-w-md">
                        <LightGreenGlassBtn label="Повторить загрузку" onClick={() => refetch()} />
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {isFetching && userDays.length > 0 && (
                        <Spinner className="justify-start" size="sm" label="Обновляем список дней..." />
                    )}

                    <div className="grid mt-6 grid-cols-1 gap-3">
                        {filteredList.length > 0 ? (
                            paginatedList.map(item => (
                                    <NutritionDayItem
                                        key={item.publicId}
                                        id={item.id}
                                        publicId={item.publicId}
                                        name={item.name}
                                        date={item.date}
                                        description={item.description}
                                        calories={item.calories}
                                        protein={item.protein}
                                        fat={item.fat}
                                        carb={item.carb}
                                    />
                                )
                            )
                        ) : (
                            <NullElementsError text={
                                userDays.length === 0
                                    ? "У вас пока нет добавленных дней. Нажмите «Добавить день», чтобы добавить первый."
                                    : "По заданным параметрам поиска дни не найдены. Попробуйте изменить фильтр."
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