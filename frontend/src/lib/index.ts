import {BackendApiResponse, DifficultOptionsStructure} from "@/types/indexTypes";
import type {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {GoalPriority} from "@/types/goalTypes";

type ColorStylesChoices = DifficultOptionsStructure | GoalPriority;

export const baseUrlForBackend: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3002';

export const firstDarkColorTheme:string = 'bg-white dark:bg-neutral-800 dark:border-neutral-700';
export const secondDarkColorTheme:string = 'bg-white dark:bg-neutral-900 dark:border-neutral-700';
export const thirdDarkColorTheme:string = 'dark:bg-neutral-600 dark:border-neutral-500 dark:text-white';
export const iconDarkColorTheme:string = `dark:bg-neutral-600 dark:border-neutral-500 text-emerald-600 dark:text-emerald-400 `;

export const mainInputClasses:string = `${thirdDarkColorTheme} w-full py-2.5 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 
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
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "Низкий":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "Средний":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "Сложный":
            return "border-rose-200 bg-rose-50 text-rose-700";
        case "Высокий":
            return "border-rose-200 bg-rose-50 text-rose-700";
        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}


