import {memo} from "react";

interface MyTrainingRowProps {
    name: string;
    description: string;
    exercises: string[];
}

function MyTrainingRow({name, description, exercises}: MyTrainingRowProps ){

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-start">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                    </div>
                    {description && (
                        <p className="mt-2 text-sm text-gray-600">
                            {description}
                        </p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <div className="text-sm font-medium text-emerald-900 mb-2">Упражнения</div>
                    <div className="flex flex-wrap gap-2">
                        {exercises.map((exName, idx) => (
                            <span
                                key={`${exName}-${idx}`}
                                className="px-2 py-0.5 text-xs border rounded-full border-emerald-200 text-emerald-800 bg-emerald-50"
                            >
                                {exName}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default memo(MyTrainingRow);