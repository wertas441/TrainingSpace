import SideBarElement from "@/components/elements/SideBarElement";
import {
    CakeIcon,
    ChartBarIcon,
    HomeIcon, PuzzlePieceIcon,
    RectangleGroupIcon, SparklesIcon,
    Squares2X2Icon,
    SquaresPlusIcon, WrenchScrewdriverIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import {useMemo} from "react";

interface SideBarProps {
	activePage: string;
	isOpen: boolean;
	onClose: () => void;
}

export default function MainSideBar({ activePage, isOpen = false, onClose }: SideBarProps) {

    const mainSideBarItems = useMemo(() => [
        {
            label: 'Главная',
            link: '/',
            context: '/',
            icon: HomeIcon,
        },
        {
            label: 'Моя активность',
            link: '/my-activity',
            context: 'my-activity',
            icon: Squares2X2Icon,
        },
        {
            label: 'Добавить активность',
            link: '/add-activity',
            context: 'add-activity',
            icon: SquaresPlusIcon,
        },
        {
            label: 'Мои тренировки',
            link: '/my-training',
            context: 'my-training',
            icon: RectangleGroupIcon,
        },
        {
            label: 'Статистика',
            link: '/stats',
            context: 'stats',
            icon: ChartBarIcon,
        },
        {
            label: 'Питание',
            link: '/nutrition',
            context: 'nutrition',
            icon: CakeIcon,
        },
        {
            label: 'Цели',
            link: '/goals',
            context: 'goals',
            icon: SparklesIcon,
        },
        {
            label: 'Техника упражнений',
            link: '/exercises-techniques',
            context: 'exercises-techniques',
            icon: PuzzlePieceIcon,
        },
        {
            label: 'Настройки',
            link: '/settings/profile',
            context: 'settings',
            icon: WrenchScrewdriverIcon,
        },
    ], []);

	return (
		<>
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
							active={activePage === item.context}
                            onClick={onClose}
						/>
					))}
				</nav>
			</aside>
		</>
	);
}