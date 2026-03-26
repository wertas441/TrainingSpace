'use client'

import DashboardStopwatchCard from "@/entities/dashboard/UI/DashboardStopwatchCard";
import DashboardCalendarCard from "@/entities/dashboard/UI/DashboardCalendarCard";
import DashboardQuickActionsCard from "@/entities/dashboard/UI/DashboardQuickActionsCard";
import DashboardChartCard from "@/entities/dashboard/UI/DashboardChartCard";
import DashboardGoalsCard from "@/entities/dashboard/UI/DashboardGoalsCard";
import {GoalShortyStructure} from "@/entities/goal/model/type";
import {NutritionStatisticsGraphicResponse} from "@/entities/statistic/model/type";
import {getUserData, useUserStore} from "@/entities/user/model/store";

interface IProps {
    goalsShortyList: GoalShortyStructure[],
    nutritionGraphicData: NutritionStatisticsGraphicResponse[],
}

export default function Dashboard({goalsShortyList, nutritionGraphicData}: IProps) {

    const userData = useUserStore(getUserData)

    return (
        <main className="w-full p-4 sm:p-6 lg:p-8 ">
            <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-semibold text-emerald-900 dark:text-white">
                    Приветствую {userData?.userName}
                </h1>

                <section className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
                    <DashboardStopwatchCard />

                    <DashboardCalendarCard />

                    <DashboardQuickActionsCard />
                </section>

                <section className="grid items gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <DashboardChartCard nutritionGraphicData={nutritionGraphicData} />
                    </div>

                    <DashboardGoalsCard goalsShortyList={goalsShortyList} />
                </section>
            </div>
        </main>
    );
}