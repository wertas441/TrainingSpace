import {ReactNode} from "react";

export default function SettingsPageContext({children}: { children: ReactNode }) {

    return (
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
            {children}
        </div>
    )
}