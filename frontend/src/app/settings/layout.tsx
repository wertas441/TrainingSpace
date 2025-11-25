'use client'

import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import SettingsSideBar from "@/components/UI/sidebars/SettingsSideBar";

export default function SettingsLayout({children}:{children: ReactNode}) {

    const pathname = usePathname()

    return (
        <div className="w-full">
            <div className="w-full flex flex-col lg:flex-row gap-6">

               <SettingsSideBar pathname={pathname} />

                <main className="w-full rounded-lg bg-white">
                    {children}
                </main>
            </div>
        </div>
    )
}