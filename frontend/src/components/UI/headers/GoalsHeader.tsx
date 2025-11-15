import FilterInput from "@/components/inputs/FilterInput";
import {memo, useCallback, useMemo} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {PlusIcon} from "@heroicons/react/16/solid";
import {HeaderMinimumProps} from "@/types/indexTypes";
import {useRouter} from "next/navigation";

function GoalsHeader({ref, searchName, setSearchName}:HeaderMinimumProps){

    const router = useRouter();
    
    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Цели</h1>
                </div>

                <div className="flex items-center gap-5 justify-between " ref={ref}>
                    <FilterInput
                        id="goals-search-name"
                        placeholder="Поиск по названию цели"
                        value={searchName}
                        onChange={(v) => setSearchName(String(v))}
                        icon={useMemo(() => <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />, [])}
                    />
                    <div className="flew-row md:flex gap-2 ">
                        <button
                            className={'inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-200 bg-white ' +
                                'px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition'}
                            onClick={useCallback(() => router.push('/goals/add'), [router])}
                        >
                            {useMemo(() => <PlusIcon className={`h-6 w-6 text-emerald-600`} />, [])}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(GoalsHeader);