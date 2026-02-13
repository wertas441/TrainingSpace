import {ElementType} from "react";

interface IProps{
    label: string;
    icon: ElementType;
    value: number;
}

export default function NutritionInfo({label, icon, value}:IProps){

    const IconComponent = icon;

    return (
        <div className={`dark:bg-neutral-800 dark:border-neutral-700 flex items-center gap-3 rounded-md border border-emerald-100 px-3 py-2`}>
            <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-sm">
                <div className="text-gray-500 dark:text-white">{label}</div>
                <div className="font-semibold text-gray-900 dark:text-white">{value}</div>
            </div>
        </div>
    )
}