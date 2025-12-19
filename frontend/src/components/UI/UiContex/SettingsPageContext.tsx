import {ReactNode} from "react";
import {secondDarkColorTheme} from "@/lib";

export default function SettingsPageContext({children}: { children: ReactNode }) {

    return (
        <div className={`${secondDarkColorTheme} border border-emerald-100 rounded-2xl shadow-sm overflow-hidden`}>
            {children}
        </div>
    )
}