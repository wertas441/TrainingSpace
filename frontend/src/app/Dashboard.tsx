'use client'

import DashboardStopwatchCard from "@/components/UI/dashboard/DashboardStopwatchCard";
import DashboardCalendarCard from "@/components/UI/dashboard/DashboardCalendarCard";
import DashboardQuickActionsCard from "@/components/UI/dashboard/DashboardQuickActionsCard";
import DashboardChartCard from "@/components/UI/dashboard/DashboardChartCard";
import DashboardGoalsCard from "@/components/UI/dashboard/DashboardGoalsCard";
import {GoalShortyStructure} from "@/types/goalTypes";
import {NutritionStatisticsGraphicResponse} from "@/types/statisticsTypes";

interface DashboardProps {
    goalsShortyList: GoalShortyStructure[],
    nutritionGraphicData: NutritionStatisticsGraphicResponse[],
}

export default function Dashboard({goalsShortyList, nutritionGraphicData}: DashboardProps) {

    return (
        <main className="w-full p-4 sm:p-6 lg:p-8 ">
            <div className=" space-y-6">
                <h1 className="text-3xl sm:text-4xl font-semibold text-emerald-900">
                    Приветствую в TrainingSpace
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