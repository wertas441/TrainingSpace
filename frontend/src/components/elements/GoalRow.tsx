import {GoalsStructure} from "@/types/goal";
import {memo, useCallback, useState} from "react";
import ChangeButton from "@/components/buttons/other/ChangeButton";
import CheckButton from "@/components/buttons/other/CheckButton";
import {getColorStyles, secondDarkColorTheme} from "@/styles";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import {useCompleteGoalMutation} from "@/lib/hooks/mutations/goal";

interface IProps extends GoalsStructure{
    token: string;
}

function GoalRow({publicId, name, description, priority, token}: IProps ) {

    const [isCompleting, setIsCompleting] = useState<boolean>(false);

    const [isHidden, setIsHidden] = useState<boolean>(false);

    const { goToPage } = usePageUtils();
    const {mutate: completeGoalMutate, isPending: isCompletingPending} = useCompleteGoalMutation(token);

    const handleCompleteClick = useCallback(() => {
        if (isCompleting || isCompletingPending) return;
        setIsCompleting(true);

        completeGoalMutate(publicId, {
            onSuccess: () => {
                // Даем анимации завершения отработать перед удалением карточки из списка
                setTimeout(() => {
                    setIsHidden(true);
                }, 300);
            },
            onError: (error) => {
                console.error('Ошибка при выполнении цели', error);
                setIsCompleting(false);
            },
        });
    }, [isCompleting, isCompletingPending, completeGoalMutate, publicId]);

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

                    <p className={`mt-1 text-sm break-words dark:text-emerald-500 whitespace-pre-wrap ${isCompleting ? 'text-gray-300' : 'text-gray-600 '}`}>
                        {description}
                    </p>
                </div>

                <div className="mt-3 md:mt-0 md:ml-4 flex w-full md:w-auto items-center gap-3">
                    <CheckButton
                        onClick={handleCompleteClick}
                        className={'w-full'}
                        disabled={isCompleting || isCompletingPending}
                    />

                    <ChangeButton
                        onClick={() => goToPage(`/goals/${publicId}`)}
                        className={'w-full'}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(GoalRow);