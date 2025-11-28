import {ElementType} from "react";

interface NutritionInfoProps{
    label: string;
    icon: ElementType;
    value: number;
}

export default function NutritionInfo({label, icon, value}:NutritionInfoProps){

    const IconComponent = icon;

    return (
        <div className="flex items-center gap-3 rounded-md border border-emerald-100 px-3 py-2">
            <IconComponent className="w-5 h-5 text-emerald-600" />
            <div className="text-sm">
                <div className="text-gray-500">{label}</div>
                <div className="font-semibold text-gray-900">{value}</div>
            </div>
        </div>
    )
}