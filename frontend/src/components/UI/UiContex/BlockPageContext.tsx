import {ReactNode} from "react";
import {secondDarkColorTheme} from "@/styles";

export default function BlockPageContext({children}: {children: ReactNode}) {

    return (
        <main className="flex items-center justify-center md:min-h-full min-h-screen p-4">
            <div className={`${secondDarkColorTheme} w-full max-w-lg p-8 space-y-8 rounded-2xl shadow-xl border border-emerald-100`}>
                {children}
            </div>
        </main>
    )
}