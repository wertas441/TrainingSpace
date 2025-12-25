'use client'

import {ReactElement, ReactNode, useCallback, useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import MainHeader from "@/components/UI/headers/MainHeader";
import MainSideBar from "@/components/UI/sidebars/MainSideBar";
import {firstDarkColorTheme} from "@/styles";

export default function LayoutWrapper({children}: {children: ReactNode}):ReactElement {

	const pathname: string = usePathname();
	const isAuthPage: boolean = pathname.startsWith('/auth');
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const activeContext: string = useMemo(() => {
		const segments = pathname.split('/').filter(Boolean);
		if (segments.length === 0) {
			return '/';
		}
		return segments[0];
	}, [pathname]);

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen(prev => !prev);
	}, []);

	return (
		<div className={`${firstDarkColorTheme} min-h-screen flex overflow-x-hidden`}>
			<div className="flex-1 flex flex-col overflow-x-hidden">
				{!isAuthPage && (
					<MainHeader onToggleSidebar={toggleSidebar} />
				)}

				<div className="flex flex-1 relative overflow-x-hidden">
					{!isAuthPage && (
						<MainSideBar
                            activePage={activeContext}
                            isOpen={isSidebarOpen}
                            onClose={toggleSidebar}
                        />
					)}
					<main className="flex-1 p-4 relative overflow-x-hidden">
						{children}
					</main>
				</div>
			</div>
		</div>
	)
}