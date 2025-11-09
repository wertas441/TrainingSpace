import SideBarElement from "@/components/elements/SideBarElement";
import {mainSideBarItems} from "@/lib";
import {XMarkIcon} from "@heroicons/react/24/outline";

interface SideBarProps {
	activePage: string;
	isOpen: boolean;
	onClose: () => void;
}

export default function SideBar({ activePage, isOpen = false, onClose }: SideBarProps) {

	return (
		<>
			{/* Мобильный оверлей */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/30 backdrop-blur-[1px] lg:hidden z-40"
					aria-hidden="true"
				/>
			)}

			<aside
				className={`
				fixed lg:static top-0 left-0 h-full lg:h-auto
				w-72 border-r border-emerald-100 p-4 bg-white
				transform transition-transform duration-300 ease-in-out z-50
				${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
			`}
				aria-label="Боковая навигация"
			>

                <div className="lg:hidden flex justify-between items-center pb-3 ">
                    <h1 className={`lg:text-2xl md:text-2xl text-xl font-semibold text-emerald-800`}>TrainingSpace</h1>
                    <button onClick={onClose} className={``}>
                        <XMarkIcon className={`h-7 w-7 mr-2 `} />
                    </button>
                </div>

				<nav className="mt-6 list-none space-y-5 ">
					{mainSideBarItems.map((item, index) => (
						<SideBarElement
							key={index}
							label={item.label}
							link={item.link}
							icon={item.icon}
							active={activePage === item.link}
                            onClick={onClose}
						/>
					))}
				</nav>
			</aside>
		</>
	);
}