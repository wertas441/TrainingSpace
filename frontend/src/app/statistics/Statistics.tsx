'use client'

import StatisticsHeader from "@/components/UI/headers/StatisticsHeader";
import StatisticsMainCard from "@/components/UI/StatisticsMainCard";
import {MainStatisticsCardResponse, NutritionStatisticsCardResponse} from "@/types/statisticsTypes";
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

interface StatisticsProps {
    mainCardData: MainStatisticsCardResponse | undefined;
    nutritionCardData: NutritionStatisticsCardResponse | undefined,
}

export default function Statistics({mainCardData, nutritionCardData}: StatisticsProps) {

    const mainCardInfo = [
        {
            id: "totalDays",
            label: "Добавлено дней",
            value: mainCardData?.totalDays ?? 0,
            description: "Сколько дней вы уже отслеживаете питание",
            icon: CalendarDaysIcon,
        },
        {
            id: "totalTraining",
            label: "Создано тренировок",
            value: mainCardData?.totalTraining ?? 0,
            description: "Сколько вами всего создано тренировок",
            icon: ChartBarIcon,
        },
        {
            id: "totalGoalComplete",
            label: "Целей достигнуто",
            value: mainCardData?.totalGoalComplete ?? 0,
            description: "Количество успешно выполненных целей",
            icon: FlagIcon,
        },
        {
            id: "totalActivity",
            label: "Добавлено активностей",
            value: mainCardData?.totalActivity ?? 0,
            description: "Сколько активности вы уже добавили",
            icon: BoltIcon,
        },
    ];

    const nutritionCardInfo = [
        {
            id: "averageCalories",
            label: "Средний калораж",
            value: nutritionCardData?.averageCalories ?? 0,
            description: "Среднее кол-во калорий потребляемое в день",
            icon: FireIcon,
        },
        {
            id: "averageProtein",
            label: "Средний белок",
            value: nutritionCardData?.averageProtein ?? 0,
            description: "Среднее кол-во белка потребляемое в день",
            icon: BeakerIcon,
        },
        {
            id: "averageFat",
            label: "Средний жир",
            value: nutritionCardData?.averageFat ?? 0,
            description: "Среднее кол-во жира потребляемое в день",
            icon: ScaleIcon,
        },
        {
            id: "averageCarb",
            label: "Средние углеводы",
            value: nutritionCardData?.averageCarb ?? 0,
            description: "Среднее кол-во углеводов потребляемое в день",
            icon: RocketLaunchIcon,
        },
    ];

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
                <h1 className="text-3xl font-semibold text-emerald-800">Питание</h1>
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
        </main>
    )
}
