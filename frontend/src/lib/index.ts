import {
    CakeIcon,
    ChartBarIcon,
    HomeIcon,
    PuzzlePieceIcon, RectangleGroupIcon,
    SparklesIcon,
    Squares2X2Icon,
    SquaresPlusIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";

export const baseUrlForBackend:string = 'localhost:9000';

export const mainInputClasses:string = `w-full py-3 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-400 ease-in-out duration-300 transition-shadow `;

export const mainSideBarItems = [
    {
        label: 'Главная',
        link: '/',
        icon: HomeIcon,
    },
    {
        label: 'Моя активность',
        link: '/my-activity',
        icon: Squares2X2Icon,
    },
    {
        label: 'Добавить активность',
        link: '/add-activity',
        icon: SquaresPlusIcon,
    },
    {
        label: 'Мои тренировки',
        link: '/my-training',
        icon: RectangleGroupIcon,
    },
    {
        label: 'Статистика',
        link: '/stats',
        icon: ChartBarIcon,
    },
    {
        label: 'Питание',
        link: '/nutrition',
        icon: CakeIcon,
    },
    {
        label: 'Цели',
        link: '/goals',
        icon: SparklesIcon,
    },
    {
        label: 'Техника упражнений',
        link: '/exercises-techniques',
        icon: PuzzlePieceIcon,
    },
    {
        label: 'Настройки',
        link: '/settings',
        icon: WrenchScrewdriverIcon,
    },
]


