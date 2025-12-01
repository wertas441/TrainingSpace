import {ComponentType, memo, SVGProps} from "react";

interface SettingsHeaderProps {
    label: string;
    text: string;
    IconComponent?: ComponentType<SVGProps<SVGSVGElement>>;
}

function SettingsHeader({label, text, IconComponent}: SettingsHeaderProps){

    return (
        <div className="border-b border-emerald-50 px-6 py-4 sm:px-8 sm:py-5 bg-emerald-50/40 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-900">
                    {label}
                </h1>
                <p className="mt-1 text-sm text-emerald-900/70">
                    {text}
                </p>
            </div>
            {IconComponent && (
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <IconComponent className="h-6 w-6 text-emerald-600" />
                </div>
            )}
        </div>
    )
}

export default memo(SettingsHeader);