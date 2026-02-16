import {memo} from "react";
import {secondDarkColorTheme} from "@/styles";

interface IProps {
    name: string;
    description: string;
    achieve_at: string;
}

function CompleteGoalRow({name, description, achieve_at}: IProps){

    return (
        <div className={`${secondDarkColorTheme} w-full rounded-lg border border-emerald-100 p-4 shadow-sm transition-all duration-300 ease-out opacity-100 hover:shadow-md`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold text-gray-800 dark:text-white`}>{name}</h3>
                    </div>

                    <p className={`mt-1 text-sm break-words whitespace-pre-wrap text-gray-600 dark:text-emerald-500`}>
                        {description}
                    </p>

                    <span className={`inline-flex text-gray-600 dark:text-white items-center pt-3 text-xs font-medium rounded-full`}>
                            Цель достигнута: {new Date(achieve_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                        </span>
                </div>
            </div>
        </div>
    );
}

export default memo(CompleteGoalRow);