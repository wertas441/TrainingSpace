import {GoalPriority, GoalsStructure} from "@/types/goalTypes";
import {memo, useCallback, useMemo} from "react";
import {useRouter} from "next/navigation";
import {PencilSquareIcon} from "@heroicons/react/24/outline";

function getDifficultyStyles(priority: GoalPriority) {
    switch (priority) {
        case "Низкий":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "Средний":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "Высокий":
            return "border-rose-200 bg-rose-50 text-rose-700";
        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}

function GoalItem({id, name, description, priority}: GoalsStructure ) {

    const badgeClasses = `inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getDifficultyStyles(priority)}`;

    const router = useRouter();
    const callBackRouter = useCallback(() => {
        router.push(`/goals/${id}`);
    }, [id, router])
    
    return (
        <div className="w-full rounded-lg border border-emerald-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 ">
                        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                        <span className={badgeClasses}>
                            {priority === 'Низкий' ? 'Лёгкий' : priority === 'Средний' ? 'Средний' : 'Высокий'}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {description}
                    </p>
                </div>
                <div className="flex items-center ">
                    <button
                        className={`inline-flex cursor-pointer  items-center justify-center rounded-md border border-emerald-200 bg-white
                         py-2 px-2.5 text-sm text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition`}
                        onClick={callBackRouter}
                    >
                        {useMemo(() => <PencilSquareIcon className={`h-7 w-7`} />, [] )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(GoalItem);