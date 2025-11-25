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

