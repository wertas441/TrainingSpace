'use client'

import {ReactElement, ReactNode, useCallback, useState} from "react";
import {usePathname} from "next/navigation";
import MainHeader from "@/components/UI/headers/MainHeader";
import MainSideBar from "@/components/UI/sidebars/MainSideBar";

export default function LayoutWrapper({children}: {children: ReactNode}):ReactElement {

	const pathname: string = usePathname();
	const isAuthPage: boolean = pathname.startsWith('/auth');
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen(prev => !prev);
	}, []);

	return (
		<div className="min-h-screen flex overflow-x-hidden">
			<div className="flex-1 flex flex-col overflow-x-hidden">
				{!isAuthPage && (
					<MainHeader onToggleSidebar={toggleSidebar} />
				)}

				<div className="flex flex-1 relative overflow-x-hidden">
					{!isAuthPage && (
						<MainSideBar
                            activePage={pathname}
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