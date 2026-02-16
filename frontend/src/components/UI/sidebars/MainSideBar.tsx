import { useEffect } from "react";
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
import AnyStylesButton from "@/components/buttons/other/AnyStylesButton";
import {firstDarkColorTheme} from "@/styles";

interface IProps {
	activePage: string;
	isOpen: boolean;
	onClose: () => void;
}

const mainSideBarItems = [
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
        link: '/statistics',
        context: 'statistics',
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
] as const;

export default function MainSideBar({ activePage, isOpen = false, onClose }: IProps) {

    // Блокируем прокрутку страницы при открытом сайдбаре на мобильных устройствах
    useEffect(() => {
        if (!isOpen) return;
        if (typeof window === "undefined") return;

        const isMobile = window.innerWidth < 1024; // соответствует breakpoint lg
        if (!isMobile) return;

        const body = document.body;
        const previousOverflow = body.style.overflow;
        body.style.overflow = "hidden";

        // При закрытии сайдбара или размонтировании возвращаем предыдущее значение
        return () => {
            body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

	return (
		<>
			{isOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] lg:hidden z-40" aria-hidden="true" onClick={onClose}/>
			)}

			<aside className={`${firstDarkColorTheme}	fixed lg:static top-0 left-0 h-full lg:h-auto w-72 border-r border-emerald-100 px-4 pt-2 bg-white
			    transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
				aria-label="Боковая навигация"
			>

                <div className="lg:hidden flex justify-between items-center pb-5 ">
                    <h1 className={`text-2xl pt-1 font-semibold text-emerald-800 dark:text-white`}>TrainingSpace</h1>

                    <AnyStylesButton onClick={onClose} IconComponent={XMarkIcon}/>
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