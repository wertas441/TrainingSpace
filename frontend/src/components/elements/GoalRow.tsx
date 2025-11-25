import {GoalPriority, GoalsStructure} from "@/types/goalTypes";
import {memo, useCallback} from "react";
import {useRouter} from "next/navigation";
import ChangeButton from "@/components/buttons/other/ChangeButton";

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

function GoalRow({id, name, description, priority}: GoalsStructure ) {

    const badgeClasses = `inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getDifficultyStyles(priority)}`;
    const router = useRouter();

    return (
        <div className="w-full rounded-lg border border-emerald-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 ">
                        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                        <span className={badgeClasses}>
                            {priority === 'Низкий' ? 'Низкий' : priority === 'Средний' ? 'Средний' : 'Высокий'}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {description}
                    </p>
                </div>
                <div className="flex items-center ">
                    <ChangeButton
                        onClick={useCallback(() => router.push(`/goals/${id}`), [id, router])}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(GoalRow);