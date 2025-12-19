import {ElementType} from "react";
import {thirdDarkColorTheme} from "@/lib";

interface InformationPageBlockProps {
    label: string;
    text: string;
    icon: ElementType;
}

export default function InformationPageBlock({label, text, icon}: InformationPageBlockProps) {

    const IconComponent = icon;

    return (
        <div className={`${thirdDarkColorTheme} rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5 flex gap-3`}>
            <div className="mt-1">
                <IconComponent className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-emerald-600">
                    {label}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-white">
                    {text}
                </p>
            </div>
        </div>
    )
}