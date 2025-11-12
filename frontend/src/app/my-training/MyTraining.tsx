'use client'

import MainPagination from "@/components/UI/MainPagination";
import MyTrainingHeader from "@/components/UI/headers/MyTrainingHeader";
import {usePagination} from "@/lib/hooks/usePagination";
import {useMemo, useState} from "react";
import {exercises} from "@/lib/data/exercises";
import MyTrainingItem from "@/components/elements/MyTrainingItem";
import {TrainingDataStructure} from "@/types/indexTypes";

export default function MyTraining({trainingList}:{trainingList: TrainingDataStructure[]} ) {

    const [searchName, setSearchName] = useState<string>('');
    const itemsPerPage:number = 10;

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

    return (
        <div className="training">
            <MyTrainingHeader
                searchName={searchName}
                onSearchNameChange={setSearchName}
                ref={listTopRef}
            />

            {/*<div className="grid mt-6 grid-cols-1 gap-3">*/}
            {/*    {filteredList.length > 0 ? (*/}
            {/*        paginatedList.map((item, index) => (*/}
            {/*            <MyTrainingItem*/}
            {/*                key={index}*/}
            {/*                name={item}*/}
            {/*                description={item}*/}
            {/*                exercises={exercises}*/}
            {/*            />*/}
            {/*            )*/}
            {/*        )*/}
            {/*    ) : (*/}
            {/*        <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">*/}
            {/*            Такой тренировки не найдено. Попробуйте изменить запрос.*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}

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