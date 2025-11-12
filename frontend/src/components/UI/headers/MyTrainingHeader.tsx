import FilterInput from "@/components/inputs/FilterInput";
import {Bars3Icon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {Ref, useMemo} from "react";
import {PlusIcon} from "@heroicons/react/16/solid";

interface MyTrainingHeaderProps {
    ref: Ref<HTMLDivElement>;
    searchName: string;
    onSearchNameChange: (newValue: string) => void;
}

export default function MyTrainingHeader(
    {
        ref,
        searchName,
        onSearchNameChange
    }:MyTrainingHeaderProps) {



    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Мои тренировки</h1>
                </div>

                <div className="flex items-center gap-5 " ref={ref}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FilterInput
                            id="training-search-name"
                            placeholder="Поиск по названию тренировки"
                            value={searchName}
                            onChange={(v) => onSearchNameChange(String(v))}
                            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                        />
                    </div>

                    <div className="flew-row md:flex gap-2 ">
                        <Link
                            className={'inline-flex w-full items-center justify-center rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition'}
                            href={'/my-training/add'}
                        >
                            {useMemo(() => <PlusIcon className={`h-6 w-6 text-emerald-600`} />, [])}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};