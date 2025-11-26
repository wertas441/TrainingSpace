import {CalendarDaysIcon, FireIcon, BeakerIcon, ScaleIcon, Squares2X2Icon} from "@heroicons/react/24/outline";
import {NutritionDay} from "@/types/nutritionTypes";
import {memo, useCallback, useMemo} from "react";
import ChangeButton from "@/components/buttons/other/ChangeButton";
import {useRouter} from "next/navigation";
import NutritionInfo from "@/components/elements/NutritionInfo";


function NutritionDayRow({ id, name, date, description, calories, protein, fat, carb }: NutritionDay) {

    const router = useRouter();
    const informationElements = useMemo(() =>[
        {
            label: 'Ккал',
            icon: FireIcon,
            value: calories,
        },
        {
            label: 'Белки',
            icon: BeakerIcon,
            value: protein,
        },
        {
            label: 'Жиры',
            icon: ScaleIcon,
            value: fat,
        },
        {
            label: 'Углеводы',
            icon: Squares2X2Icon,
            value: carb,
        },
    ], [calories, carb, fat, protein])

	return (
		<div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center">
				<div className="md:col-span-2">
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold text-gray-900">{name}</h3>
						<span className="inline-flex items-center gap-1 text-sm text-gray-600">
							<CalendarDaysIcon className="w-4 h-4" />
                            {date}
						</span>
					</div>
					{description && (
						<p className="mt-2 text-sm text-gray-600">
							{description}
						</p>
					)}
				</div>

				<div className="flex-row md:flex justify-end gap-3 md:col-span-2">
					<div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {informationElements.map((element, index) => (
                            <NutritionInfo
                                key={index}
                                label={element.label}
                                icon={element.icon}
                                value={element.value}
                            />
                        ))}
					</div>
                    <div className="flex items-center mt-5 md:mt-0 ">
                        <ChangeButton
                            onClick={useCallback(() => router.push(`/nutrition/${id}`), [id, router])}
                            className={`w-full`}
                        />
                    </div>
				</div>
			</div>
		</div>
	);
}

export default memo(NutritionDayRow);
