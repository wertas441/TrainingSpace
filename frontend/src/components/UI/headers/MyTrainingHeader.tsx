import FilterInput from "@/components/inputs/FilterInput";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {memo, useCallback, useMemo} from "react";
import {HeaderMinimumProps} from "@/types/indexTypes";
import {useRouter} from "next/navigation";
import PlusButton from "@/components/buttons/other/PlusButton";

function MyTrainingHeader({searchName, setSearchName}:HeaderMinimumProps) {

    const router = useRouter();

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Мои тренировки</h1>
                </div>

                <div className="flex items-center gap-5">
                    <div className="w-full md:w-80">
                        <FilterInput
                            id="training-search-name"
                            placeholder="Поиск по названию тренировки..."
                            value={searchName}
                            onChange={(v) => setSearchName(String(v))}
                            icon={useMemo(() => <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />, [])}
                        />
                    </div>
                    <div className="flew-row md:flex gap-2 ">
                        <PlusButton
                            onClick={useCallback(() => router.push('/my-training/add'), [router])}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(MyTrainingHeader);