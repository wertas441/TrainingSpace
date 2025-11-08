// import DarkVeil from "@/components/UI/modern/DarkVeil";
import {ReactNode} from "react";

export default function AuthContext({children}: {children: ReactNode}) {

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            {/*<div className="absolute h-full inset-0 z-0">*/}
            {/*    <DarkVeil*/}
            {/*        hueShift={-10}*/}
            {/*        noiseIntensity={0.02}*/}
            {/*        scanlineIntensity={0.1}*/}
            {/*        speed={0.4}*/}
            {/*        scanlineFrequency={2.0}*/}
            {/*        warpAmount={0.1}*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
                {children}
            </div>
        </main>
    )
}