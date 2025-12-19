import {memo, useMemo} from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import {NutritionStatisticsGraphicResponse} from "@/types/statisticsTypes";


interface NutritionTrendChartProps {
    days: NutritionStatisticsGraphicResponse[];
    metric: 'calories' | 'protein' | 'fat' | 'carb';
}

const CustomTooltip = ({active, payload}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const item = payload[0]?.payload as any;

    return (
        <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs shadow-sm">
            <p className="font-semibold text-emerald-800 mb-1">
                {item.fullDate}
            </p>
            <p className="text-gray-700 py-1">Калории: <span className="font-semibold">{item.calories}</span></p>
            <p className="text-gray-700 py-1">Белки: <span className="font-semibold">{item.protein}</span></p>
            <p className="text-gray-700 py-1">Жиры: <span className="font-semibold">{item.fat}</span></p>
            <p className="text-gray-700 py-1">Углеводы: <span className="font-semibold">{item.carb}</span></p>
        </div>
    );
};

const metricConfig = {
    calories: {key: "calories", name: "Калории", color: "#059669"},
    protein: {key: "protein", name: "Белки", color: "#059669"},
    fat: {key: "fat", name: "Жиры", color: "#059669"},
    carb: {key: "carb", name: "Углеводы", color: "#059669"},
} as const;

function NutritionTrendChart({days, metric}: NutritionTrendChartProps) {

    const chartData = useMemo(() => {
        if (!days || days.length === 0) return [];

        // сортируем по дате по возрастанию
        const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

        return sorted.map((d) => {
            // ожидаемый формат даты с бэка: YYYY-MM-DD
            const [day, month] = d.date.split("-");
            const shortLabel = `${day}.${month}`; // 31.12

            return {
                date: shortLabel,
                fullDate: d.date,
                calories: d.calories,
                protein: d.protein,
                fat: d.fat,
                carb: d.carb,
            };
        });
    }, [days]);

    if (!chartData.length) {
        return (
            <div className="flex h-full items-center justify-center text-xs text-gray-500">
                Недостаточно данных для построения графика. Добавьте несколько дней питания.
            </div>
        );
    }



    const {key, name, color} = metricConfig[metric];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{top: 10, right: 20, bottom: 10, left: 0}}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5F5EC"/>
                <XAxis
                    dataKey="date"
                    tick={{fontSize: 11, fill: "#6B7280"}}
                    tickMargin={8}
                />
                <YAxis
                    tick={{fontSize: 11, fill: "#6B7280"}}
                    tickMargin={8}
                />
                <Tooltip content={
                    <CustomTooltip/>
                }/>
                <Legend wrapperStyle={{fontSize: 11}}/>
                <Line
                    type="monotone"
                    dataKey={key}
                    name={name}
                    stroke={color}
                    strokeWidth={2}
                    dot={{r: 3}}
                    activeDot={{r: 5}}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default memo(NutritionTrendChart);


