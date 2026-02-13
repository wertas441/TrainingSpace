import {CalendarDaysIcon, ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";
import {memo, useCallback, useMemo, useState} from "react";
import {ActivityDataStructure} from "@/types/activity";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import {getTrainingExercises} from "@/lib/controllers/activity";
import ChangeButton from "@/components/buttons/other/ChangeButton";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {getColorStyles, iconDarkColorTheme, secondDarkColorTheme} from "@/styles";


function MyActivityRow({activity}: {activity: ActivityDataStructure}){

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(false);
    const [trainingExercises, setTrainingExercises] = useState<ExerciseTechniqueItem[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const {router} = usePageUtils();

    const toggleExpanded = useCallback(async () => {
        setIsExpanded((prev) => !prev);

        if (!isExpanded && trainingExercises === null) {
            try {
                setIsLoadingExercises(true);
                setLoadError(null);
                const data = await getTrainingExercises(activity.trainingId);
                setTrainingExercises(data);
            } catch (e) {
                console.error('Ошибка загрузки упражнений тренировки:', e);
                setLoadError('Не удалось загрузить упражнения тренировки');
            } finally {
                setIsLoadingExercises(false);
            }
        }
    }, [isExpanded, trainingExercises, activity.trainingId]);

    const activityHeader = useMemo(() => {
        return {
            name: activity.name,
            date: activity.activityDate,
            description: activity.description,
            type: activity.type,
            difficulty: activity.difficulty,
        };
    }, [activity.name, activity.activityDate, activity.description, activity.type, activity.difficulty]);

    const handleEditClick = useCallback(() => {
        router.push(`/my-activity/${activity.publicId}`);
    }, [router, activity.publicId]);

    return (
        <div className={`${secondDarkColorTheme} w-full border border-emerald-100 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-pointer`}
            onClick={toggleExpanded}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-start md:items-center">
                <div className="md:col-span-2 flex items-start md:items-center gap-3 sm:gap-4 md:gap-8 px-1">
                    <div className={`${iconDarkColorTheme} border rounded-full p-1.5 sm:p-2 border-emerald-200 flex items-center justify-center`}>
                        {isExpanded ? (
                            <ChevronDownIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                            <ChevronUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                    </div>

                    <div className="">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{activityHeader.name}</h3>
                            <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-white">
							<CalendarDaysIcon className="w-4 h-4" />
                                {activityHeader.date}
						</span>
                        </div>
                        {activityHeader.description && (
                            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-emerald-500">
                                {activityHeader.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="flex flex-col items-center gap-3 md:flex-row md:justify-end md:gap-7">
                        <div className="flex flex-wrap my-3 gap-2 sm:gap-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs sm:text-sm
                                lg:text-base font-medium border ${getColorStyles(activityHeader.type)}`}>
                                {activityHeader.type}
                            </span>
                        <span className={`inline-flex items-center rounded-full  px-2.5 py-1 text-xs sm:text-sm lg:text-base
                            font-medium border ${getColorStyles(activityHeader.difficulty)}`}>
                                {activityHeader.difficulty}
                            </span>
                        </div>
                        <div
                            className="w-full md:w-auto "
                            onClick={(event) => event.stopPropagation()}
                        >
                            <ChangeButton
                                onClick={handleEditClick}
                                className={`w-full`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-neutral-700">
                    {isLoadingExercises && (
                        <div className="text-sm text-gray-500">
                            Загрузка упражнений...
                        </div>
                    )}

                    {loadError && !isLoadingExercises && (
                        <div className="text-sm text-red-500">
                            {loadError}
                        </div>
                    )}

                    {!isLoadingExercises && !loadError && (
                        <div className="space-y-3">
                            {activity.exercises.map((ex) => {
                                const exerciseInfo = trainingExercises?.find((t) => t.id === ex.exercisesId);
                                return (
                                    <div key={ex.exercisesId} className={`dark:bg-neutral-800 dark:border-neutral-600
                                    rounded-lg bg-emerald-50/60 border border-emerald-100 px-3 py-2`}>
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-emerald-900 dark:text-white">
                                                    {exerciseInfo?.name ?? `Упражнение #${ex.exercisesId}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {ex.try.map((set) => (
                                                <span
                                                    key={set.id}
                                                    className={`inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs 
                                                        text-emerald-800 border border-emerald-100 dark:bg-emerald-800 
                                                        dark:text-white dark:border-emerald-700 shadow-sm`}
                                                >
                                                    {set.id} подход: {set.weight} кг × {set.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default memo(MyActivityRow);