import {CalendarDaysIcon, FireIcon, BeakerIcon, ScaleIcon, Squares2X2Icon} from "@heroicons/react/24/outline";
import {NutritionDay} from "@/types/nutritionTypes";
import {memo, useCallback} from "react";
import ChangeButton from "@/components/buttons/ChangeButton";
import {useRouter} from "next/navigation";


function NutritionDayRow({ id, name, date, description, calories, protein, fat, carb }: NutritionDay) {

    const router = useRouter();

	return (
		<div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-start">
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

				<div className="flex justify-end gap-3 md:col-span-2">
					<div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
						<div className="flex items-center gap-2 rounded-md border border-emerald-100 px-3 py-2">
							<FireIcon className="w-5 h-5 text-emerald-600" />
							<div className="text-sm">
								<div className="text-gray-500">Ккал</div>
								<div className="font-semibold text-gray-900">{calories}</div>
							</div>
						</div>
						<div className="flex items-center gap-2 rounded-md border border-emerald-100 px-3 py-2">
							<BeakerIcon className="w-5 h-5 text-emerald-600" />
							<div className="text-sm">
								<div className="text-gray-500">Белки</div>
								<div className="font-semibold text-gray-900">{protein} г</div>
							</div>
						</div>
						<div className="flex items-center gap-2 rounded-md border border-emerald-100 px-3 py-2">
							<ScaleIcon className="w-5 h-5 text-emerald-600" />
							<div className="text-sm">
								<div className="text-gray-500">Жиры</div>
								<div className="font-semibold text-gray-900">{fat} г</div>
							</div>
						</div>
						<div className="flex items-center gap-2 rounded-md border border-emerald-100 px-3 py-2">
							<Squares2X2Icon className="w-5 h-5 text-emerald-600" />
							<div className="text-sm">
								<div className="text-gray-500">Углеводы</div>
								<div className="font-semibold text-gray-900">{carb} г</div>
							</div>
						</div>
					</div>
                    <div className="flex items-center ">
                        <ChangeButton
                            onClick={useCallback(() => router.push(`/nutrition/${id}`), [id, router])}
                        />
                    </div>
				</div>
			</div>
		</div>
	);
}

export default memo(NutritionDayRow);
