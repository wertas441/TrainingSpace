'use client'

import {useMemo, useState} from "react";

export function formatDateYMD(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function useNameDateFilter<T>(
    items: T[],
    getName: (item: T) => string,
    getDate: (item: T) => Date | string,
) {
    const [searchName, setSearchName] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const byName = searchName ? getName(item).toLowerCase().includes(searchName.toLowerCase()) : true;
            const byDate = searchDate ? formatDateYMD(getDate(item)) === searchDate : true;
            return byName && byDate;
        });
    }, [items, searchName, searchDate, getName, getDate]);

    return {
        searchName,
        setSearchName,
        searchDate,
        setSearchDate,
        filteredItems,
    };
}







