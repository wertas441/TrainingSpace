import FilterInput from "@/components/inputs/FilterInput";
import {memo, useCallback, useMemo} from "react";
import {MagnifyingGlassIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon} from "@heroicons/react/24/outline";
import {HeaderMinimumProps} from "@/types/indexTypes";
import {usePathname, useRouter} from "next/navigation";
import PlusButton from "@/components/buttons/other/PlusButton";
import AnyStylesButton from "@/components/buttons/other/AnyStylesButton";

interface GoalsHeaderProps extends HeaderMinimumProps {
    label: string;
}

function GoalsHeader({label, searchName, setSearchName}:GoalsHeaderProps){

    const pathname:string = usePathname();
    const isGoalPage = pathname.endsWith("/goals");
    const router = useRouter();
    
    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">{label}</h1>
                </div>

                <div className="flex-row space-y-3 md:space-y-0 md:flex items-center gap-5 justify-between ">
                    <div className="w-full md:w-80">
                        <FilterInput
                            id="goals-search-name"
                            placeholder="Поиск по названию цели..."
                            value={searchName}
                            onChange={(v) => setSearchName(String(v))}
                            icon={useMemo(() => <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />, [])}
                        />
                    </div>

                    <div className="flex gap-3">
                        <AnyStylesButton
                            IconComponent={isGoalPage ? ClipboardDocumentCheckIcon : ClipboardDocumentListIcon}
                            onClick={useCallback(() => router.push(isGoalPage? '/goals/completed' : '/goals'), [isGoalPage, router])}
                            className="w-full"
                        />
                        <PlusButton
                            onClick={useCallback(() => router.push('/goals/add'), [router])}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(GoalsHeader);