import {GoalsStructure} from "@/types/goalTypes";
import {memo, useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import ChangeButton from "@/components/buttons/other/ChangeButton";
import CheckButton from "@/components/buttons/other/CheckButton";
import {getColorStyles, secondDarkColorTheme} from "@/lib";
import {completeGoal} from "@/lib/controllers/goalController";

interface GoalRowProps extends GoalsStructure{
    token: string;
}

function GoalRow({publicId, name, description, priority, token}: GoalRowProps ) {

    const [isCompleting, setIsCompleting] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);

    const router = useRouter();
    const changeGoalRoute = useCallback(() => router.push(`/goals/${publicId}`), [publicId, router])

    const handleCompleteClick = useCallback(() => {
        if (isCompleting) return;

        setIsCompleting(true);

        completeGoal(token, publicId)
            .then(() => {
                // Даем анимации выполниться перед скрытием и обновлением списка
                setTimeout(() => {
                    setIsHidden(true);
                    router.refresh();
                }, 300);
            })
            .catch((error) => {
                console.error('Ошибка при выполнении цели', error);
                setIsCompleting(false);
            });
    }, [token, publicId, router, isCompleting]);

    if (isHidden) {
        return null;
    }

    return (
        <div className={`${secondDarkColorTheme} w-full rounded-lg border border-emerald-100 p-4 shadow-sm transition-all duration-300 ease-out 
            ${isCompleting ? 'opacity-0 translate-y-1 scale-95' : 'opacity-100 hover:shadow-md'}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold dark:text-white ${isCompleting ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${getColorStyles(priority)}`}>
                            {priority === 'Низкий' ? 'Низкий' : priority === 'Средний' ? 'Средний' : 'Высокий'}
                        </span>
                    </div>
                    <p
                        className={`mt-1 text-sm break-words dark:text-emerald-500 whitespace-pre-wrap ${
                            isCompleting ? 'text-gray-300' : 'text-gray-600 '
                        }`}
                    >
                        {description}
                    </p>
                </div>
                <div className="mt-3 md:mt-0 md:ml-4 flex w-full md:w-auto items-center gap-3">
                    <CheckButton
                        onClick={handleCompleteClick}
                        className={'w-full'}
                        disabled={isCompleting}
                    />
                    <ChangeButton
                        onClick={changeGoalRoute}
                        className={'w-full'}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(GoalRow);