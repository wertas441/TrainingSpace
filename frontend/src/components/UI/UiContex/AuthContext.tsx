import {ReactNode} from "react";

export default function AuthContext({children}: {children: ReactNode}) {

    return (
        <main className="flex  items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                {children}
            </div>
        </main>
    )
}