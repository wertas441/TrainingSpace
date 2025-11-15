import { CalendarDaysIcon} from "@heroicons/react/24/outline";
import {memo} from "react";

interface MyActivityItemProps {
    name: string;
    date: string;
    description: string;
}

function MyActivityItem({name, date, description}:MyActivityItemProps){

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

                <div className="md:col-span-2">

                </div>
            </div>
        </div>
    )
}

export default memo(MyActivityItem);