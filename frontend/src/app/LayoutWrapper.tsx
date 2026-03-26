'use client'

import {ReactElement, ReactNode, useCallback, useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import MainSideBar from "@/widgets/MainSideBar";
import {firstDarkColorTheme} from "@/shared/styles";
import QueryProvider from "@/app/QueryProvider";
import Header from "@/widgets/Header";

export default function LayoutWrapper({children}: {children: ReactNode}):ReactElement {

	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const pathname: string = usePathname();
	const isAuthPage: boolean = pathname.startsWith('/auth');

	const activeContext: string = useMemo(() => {
		const segments = pathname.split('/').filter(Boolean);

		if (segments.length === 0) return '/';

		return segments[0];
	}, [pathname]);

	const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

	return (
        <QueryProvider>
            <div className={`${firstDarkColorTheme} min-h-screen flex overflow-x-hidden`}>
                <div className="flex-1 flex flex-col overflow-x-hidden">
                    {!isAuthPage && (
                        <Header onToggleSidebar={toggleSidebar} />
                    )}

                    <div className="flex flex-1 relative overflow-x-hidden">
                        {!isAuthPage && (
                            <MainSideBar
                                activePage={activeContext}
                                isOpen={isSidebarOpen}
                                onClose={toggleSidebar}
                            />
                        )}

                        <main className={`flex-1 ${!isAuthPage ? 'p-4 relative overflow-x-hidden' : '' }`}>
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </QueryProvider>
	)
}