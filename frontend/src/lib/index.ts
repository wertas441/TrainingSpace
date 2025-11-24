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
import type {BackendApiResponse} from "@/types/indexTypes";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";

export const baseUrlForBackend:string = 'http://localhost:3002';

export const mainInputClasses:string = `w-full py-3 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-400 ease-in-out duration-300 transition-shadow `;

export const difficultOptions = [
    { key: 'light', label: 'Лёгкая' },
    { key: 'middle', label: 'Средняя' },
    { key: 'hard', label: 'Сложная' }
];

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
        link: '/settings/profile',
        icon: WrenchScrewdriverIcon,
    },
]

export async function getExercisesList(tokenValue: string | undefined):Promise<ExerciseTechniqueItem[]>{
    try {
        const response = await fetch(`${baseUrlForBackend}/api/exercises/exercises-list`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${tokenValue}`
            },
        });

        if (!response.ok) {
            let errorMessage = "Ошибка получения списка упражнений.";
            try {
                const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;
                if (data.error || data.message) {
                    errorMessage = (data.error || data.message) as string;
                }
            } catch {
                // игнорируем, оставляем дефолтное сообщение
            }
            console.error(errorMessage);
            return [];
        }

        const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;

        if (!data.success || !data.data?.exercises) {
            return [];
        }

        return data.data.exercises;
    } catch (error) {
        console.error("Ошибка запроса списка упражнений:", error);

        return [];
    }
}

