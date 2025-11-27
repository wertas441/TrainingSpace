import {memo} from "react";
import Link from "next/link";
import {ChevronRightIcon, SparklesIcon} from "@heroicons/react/24/outline";
import {GoalShortyStructure} from "@/types/goalTypes";
import LightGreenLinkBtn from "@/components/buttons/LightGreenBtn/LightGreenLinkBtn";

interface DashboardGoalsCardProps {
    goalsShortyList: GoalShortyStructure[];
}

function DashboardGoalsCard({goalsShortyList}: DashboardGoalsCardProps) {

    const hasGoals = goalsShortyList && goalsShortyList.length > 0;
    const visibleGoals = hasGoals ? goalsShortyList.slice(0, 6) : [];
    const hasMore = hasGoals && goalsShortyList.length > 6;

    return (
        <div className="flex flex-col h-full rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                        Цели
                    </p>
                    <h2 className="text-lg font-semibold text-emerald-900">
                        Ваши актуальные цели
                    </h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <SparklesIcon className="h-5 w-5" />
                </span>
            </div>

            <div className="flex-1">
                {hasGoals ? (
                    <ul className="mt-2 space-y-2 text-sm">
                        {visibleGoals.map((goal) => (
                            <li key={goal.id}>
                                <Link
                                    href={`/goals/${goal.id}`}
                                    className="flex items-center justify-between rounded-lg border border-emerald-50 px-3 py-2 hover:bg-emerald-50 hover:border-emerald-200 transition"
                                >
                                    <span className="truncate text-gray-800">
                                        {goal.name}
                                    </span>
                                    <ChevronRightIcon className={`h-4 w-4`} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="container items-center ">
                        <LightGreenLinkBtn
                            label={`Добавить новую цель`}
                            href={`/goals/add`}
                        />
                    </div>
                )}
            </div>

            {hasMore && (
                <div className="flex justify-center">
                    <Link
                        href="/goals"
                        className="inline-flex items-center text-xs font-medium text-emerald-700 hover:text-emerald-800"
                    >
                        Перейти к полному списку
                    </Link>
                </div>
            )}
        </div>
    );
}

export default memo(DashboardGoalsCard);


