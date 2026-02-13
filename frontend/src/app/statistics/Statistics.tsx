'use client'

import {memo, useMemo, useState} from "react";
import StatisticsHeader from "@/components/UI/headers/StatisticsHeader";
import StatisticsMainCard from "@/components/UI/other/StatisticsMainCard";
import NutritionTrendChart from "@/components/UI/other/NutritionTrendChart";
import {
    MainStatisticsCardResponse,
    MetricOptionStructure,
    NutritionMetric,
    NutritionStatisticsCardResponse,
    NutritionStatisticsGraphicResponse
} from "@/types/statistics";
import {
    CalendarDaysIcon,
    FlagIcon,
    BoltIcon,
    FireIcon,
    BeakerIcon,
    RocketLaunchIcon,
    ScaleIcon
} from "@heroicons/react/24/outline";
import {ChartBarIcon} from "@heroicons/react/24/solid";
import {secondDarkColorTheme, thirdDarkColorTheme} from "@/styles";

interface IProps {
    mainCardData: MainStatisticsCardResponse;
    nutritionCardData: NutritionStatisticsCardResponse;
    nutritionGraphicData?: NutritionStatisticsGraphicResponse[];
}

const metricOptions: MetricOptionStructure[] = [
    {id: 'calories', label: 'Калории'},
    {id: 'protein', label: 'Белки'},
    {id: 'fat', label: 'Жиры'},
    {id: 'carb', label: 'Углеводы'},
] as const;

function Statistics({mainCardData, nutritionCardData, nutritionGraphicData}: IProps) {

    const [selectedMetric, setSelectedMetric] = useState<NutritionMetric>('calories');

    const mainCardInfo = useMemo(() => [
        {
            id: "totalDays",
            label: "Добавлено дней",
            value: mainCardData.totalDays,
            description: "Сколько дней вы уже отслеживаете питание",
            icon: CalendarDaysIcon,
        },
        {
            id: "totalTraining",
            label: "Создано тренировок",
            value: mainCardData.totalTraining,
            description: "Сколько вами всего создано тренировок",
            icon: ChartBarIcon,
        },
        {
            id: "totalGoalComplete",
            label: "Целей достигнуто",
            value: mainCardData.totalGoalComplete,
            description: "Количество успешно выполненных целей",
            icon: FlagIcon,
        },
        {
            id: "totalActivity",
            label: "Добавлено активностей",
            value: mainCardData.totalActivity,
            description: "Сколько активности вы уже добавили",
            icon: BoltIcon,
        },
    ], [mainCardData.totalActivity, mainCardData.totalDays, mainCardData.totalGoalComplete, mainCardData.totalTraining])

    const nutritionCardInfo = useMemo(() => [
        {
            id: "averageCalories",
            label: "Средний калораж",
            value: nutritionCardData.averageCalories,
            description: "Среднее кол-во калорий потребляемое в день",
            icon: FireIcon,
        },
        {
            id: "averageProtein",
            label: "Средний белок",
            value: nutritionCardData.averageProtein,
            description: "Среднее кол-во белка потребляемое в день",
            icon: BeakerIcon,
        },
        {
            id: "averageFat",
            label: "Средний жир",
            value: nutritionCardData.averageFat,
            description: "Среднее кол-во жира потребляемое в день",
            icon: ScaleIcon,
        },
        {
            id: "averageCarb",
            label: "Средние углеводы",
            value: nutritionCardData.averageCarb,
            description: "Среднее кол-во углеводов потребляемое в день",
            icon: RocketLaunchIcon,
        },
    ], [nutritionCardData.averageCalories, nutritionCardData.averageCarb, nutritionCardData.averageFat, nutritionCardData.averageProtein]);

    return (
        <main className="w-full space-y-6">
            <StatisticsHeader />

            <section className="grid gap-4 md:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {mainCardInfo.map((card) => (
                    <StatisticsMainCard
                        key={card.id}
                        label={card.label}
                        value={card.value}
                        description={card.description}
                        icon={card.icon}
                    />
                ))}
            </section>

            <div className="flex flex-col px-4 py-2  gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className={`text-3xl font-semibold text-emerald-800 dark:text-white`}>Питание</h1>
            </div>

            <section className="grid gap-4 md:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {nutritionCardInfo.map((card) => (
                    <StatisticsMainCard
                        key={card.id}
                        label={card.label}
                        value={card.value}
                        description={card.description}
                        icon={card.icon}
                    />
                ))}
            </section>

            <section className="grid grid-cols-1 pt-3">
                <div className={`${secondDarkColorTheme} rounded-2xl border border-emerald-100 shadow-sm p-5`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-emerald-500">
                                Динамика калорий и БЖУ
                            </h2>

                            <p className="text-xs text-gray-500">
                                Как меняется ваше потребление калорий, белков, жиров и углеводов по дням.
                            </p>
                        </div>

                        <div className={`${thirdDarkColorTheme} inline-flex gap-3 items-center my-4 md:my-0 rounded-full bg-emerald-50 p-1 text-xs border border-emerald-100`}>
                            {metricOptions.map((option) => {
                                const isActive = selectedMetric === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setSelectedMetric(option.id)}
                                        className={`px-2.5 dark:text-white cursor-pointer py-1  rounded-full font-medium transition 
                                        ${isActive
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'hover:text-emerald-700 dark:hover:text-emerald-500 text-emerald-500'}`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`mt-4 h-72 sm:h-80`}>
                        <NutritionTrendChart
                            days={nutritionGraphicData ?? []}
                            metric={selectedMetric}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default memo(Statistics);