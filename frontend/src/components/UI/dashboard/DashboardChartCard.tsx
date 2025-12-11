import {memo, useState} from "react";
import NutritionTrendChart from "@/components/UI/NutritionTrendChart";
import {MetricOptionStructure, NutritionMetric, NutritionStatisticsGraphicResponse} from "@/types/statisticsTypes";

const metricOptions: MetricOptionStructure[] = [
    {id: 'calories', label: 'Калории'},
    {id: 'protein', label: 'Белки'},
    {id: 'fat', label: 'Жиры'},
    {id: 'carb', label: 'Углеводы'},
] as const;

function DashboardChartCard({nutritionGraphicData}: {nutritionGraphicData: NutritionStatisticsGraphicResponse[]}) {

    const [selectedMetric, setSelectedMetric] = useState<NutritionMetric>('calories');

    return (
        <section className="grid grid-cols-1">
            <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                            Быстрая статистика
                        </p>
                        <h2 className="text-lg font-semibold text-emerald-900">
                            График вашего КБЖУ
                        </h2>
                    </div>

                    <div className="inline-flex gap-2 items-center my-4 md:my-0 rounded-full bg-emerald-50 p-1 text-xs border border-emerald-100">
                        {metricOptions.map((option) => {
                            const isActive = selectedMetric === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSelectedMetric(option.id)}
                                    className={`px-2.5 cursor-pointer py-1  rounded-full font-medium transition 
                                        ${isActive
                                        ? 'bg-white text-emerald-900 shadow-sm'
                                        : 'text-emerald-700/70 hover:text-emerald-900'}`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 h-72 sm:h-80">
                    <NutritionTrendChart
                        days={nutritionGraphicData ?? []}
                        metric={selectedMetric}
                    />
                </div>
            </div>
        </section>
    );
}

export default memo(DashboardChartCard);


