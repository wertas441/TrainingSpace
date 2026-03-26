import {ElementType} from "react";

interface IProps {
    title: string;
    text: string;
    IconComponent: ElementType;
}

export default function HalfContentRow({ title, text, IconComponent }: IProps) {

    return (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 font-semibold">
                <IconComponent className="h-5 w-5" />
                {title}
            </div>

            <p className="pt-1 text-sm text-emerald-50/90">
                {text}
            </p>
        </div>
    )
}