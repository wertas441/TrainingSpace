import {BackendApiResponse, DifficultOptionsStructure} from "@/types/indexTypes";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {GoalPriority} from "@/types/goalTypes";
import {ActivityDifficultyStructure, ActivityTypeStructure} from "@/types/activityTypes";

type ColorStylesChoices = DifficultOptionsStructure | GoalPriority | ActivityTypeStructure | ActivityDifficultyStructure;

export const baseUrlForBackend: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3002';

export const firstDarkColorTheme:string = 'bg-white dark:bg-neutral-800 dark:border-neutral-700';
export const secondDarkColorTheme:string = 'bg-white dark:bg-neutral-900 dark:border-neutral-700';
export const thirdDarkColorTheme:string = 'dark:bg-neutral-800 dark:border-neutral-700';
export const iconDarkColorTheme:string = `${thirdDarkColorTheme} text-emerald-600 dark:text-emerald-400 dark:hover:bg-neutral-700`;


export const mainInputClasses:string = `${thirdDarkColorTheme} w-full dark:text-white py-2.5 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-400 ease-in-out duration-300 transition-shadow `;


export async function getExercisesList(tokenValue: string | undefined):Promise<ExerciseTechniqueItem[] | undefined>{
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

            return undefined;
        }

        const data = await response.json() as BackendApiResponse<{ exercises: ExerciseTechniqueItem[] }>;

        if (!data.success || !data.data?.exercises) {

            return undefined;
        }

        return data.data.exercises;
    } catch (error) {
        console.error("Ошибка запроса списка упражнений:", error);

        return undefined;
    }
}

export function getColorStyles(colorStyles: ColorStylesChoices) {
    switch (colorStyles) {
        case "Лёгкий":
        case "Лёгкая":
        case "Низкий":
            return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:text-emerald-900  dark:bg-emerald-200 dark:border-emerald-100 ";

        case "Средняя":
        case "Средний":
            return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-200 dark:text-amber-900 dark:border-amber-100 ";

        case "Сложный":
        case "Тяжелая":
        case "Высокий":
            return "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-200 dark:border-rose-100 dark:text-rose-900 ";

        case "Силовая":
            return "border-rose-200 bg-rose-200 text-rose-600 dark:bg-rose-300 dark:border-rose-200 dark:text-rose-900 ";

        case "Кардио":
            return "border-blue-200 bg-blue-200 text-blue-600 dark:bg-blue-200 dark:border-blue-100 dark:text-blue-900 ";

        case "Комбинированный":
            return "border-yellow-200 bg-yellow-200 text-yellow-700 dark:bg-yellow-200 dark:border-yellow-100 dark:text-yellow-900 ";

        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}


