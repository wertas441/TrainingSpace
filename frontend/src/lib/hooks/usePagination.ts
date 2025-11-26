import {useEffect, useMemo, useRef, useState} from "react";

export function usePagination<T>(filteredList: T[], itemsPerPage: number){

    const [currentPage, setCurrentPage] = useState<number>(1);
    const listTopRef = useRef<HTMLDivElement | null>(null);
    const totalItems: number = filteredList.length;
    const totalPages: number = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Автоскролл к началу списка при смене страницы
    useEffect(() => {
        if (typeof window !== 'undefined' && window.scrollY === 0) {
            return;
        }

        if (listTopRef.current && typeof listTopRef.current.scrollIntoView === 'function') {
            listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    // Клэмпим текущую страницу, если фильтры уменьшили кол-во страниц
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(prev => Math.min(prev, totalPages));
    }, [totalPages]);

    const paginatedList: T[] = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredList.slice(start, end);
    }, [currentPage, itemsPerPage, filteredList]);


    return {
        currentPage,
        setCurrentPage,
        listTopRef,
        totalItems,
        totalPages,
        paginatedList
    }
}