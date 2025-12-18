import {ComponentType, memo, SVGProps, useMemo} from "react";
import {BasicIconButtonProps} from "@/types/indexTypes";
import {iconDarkColorTheme} from "@/lib";

interface AnyStylesButtonProps extends BasicIconButtonProps {
    IconComponent: ComponentType<SVGProps<SVGSVGElement>>;
}

function AnyStylesButton({IconComponent, onClick, className = ''}: AnyStylesButtonProps) {

    return (
        <button
        className={`inline-flex ${iconDarkColorTheme} cursor-pointer items-center justify-center rounded-md border border-emerald-200 ` +
                `bg-white px-3 py-2 text-sm hover:bg-emerald-50 active:bg-emerald-100 transition ${className}`}
            onClick={onClick}
        >
            {useMemo(() => <IconComponent className={`h-6 w-6  `} />, [IconComponent])}
        </button>
    )
}

export default memo(AnyStylesButton);