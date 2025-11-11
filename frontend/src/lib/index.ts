import {
    CakeIcon,
    ChartBarIcon, EnvelopeIcon,
    HomeIcon, LockClosedIcon,
    PuzzlePieceIcon, RectangleGroupIcon,
    SparklesIcon,
    Squares2X2Icon,
    SquaresPlusIcon, UserCircleIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import {SettingsMenuItemsStructure} from "@/types/indexTypes";

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
        label: 'Техника упражнений',
        link: '/exercises-techniques',
        icon: PuzzlePieceIcon,
    },
    {
        label: 'Советы',
        link: '/advises',
        icon: SparklesIcon,
    },
    {
        label: 'Настройки',
        link: '/settings',
        icon: WrenchScrewdriverIcon,
    },
]

export const settingsMenuItems: SettingsMenuItemsStructure[] = [
    { id: 'profile', label: 'Профиль', icon: UserCircleIcon },
    { id: 'password', label: 'Сменить пароль', icon: LockClosedIcon },
    { id: 'email', label: 'Сменить почту', icon: EnvelopeIcon },
    { id: 'projectInformation', label: 'Информация о проекте', icon: LockClosedIcon },
];