import {memo, useCallback, useMemo} from "react";
import ChangeButton from "@/components/buttons/other/ChangeButton";
import {useRouter} from "next/navigation";

interface MyTrainingRowProps {
    id: number;
    publicId: string;
    name: string;
    description: string;
    exercises: string[];
}

function MyTrainingRow({id, publicId, name, description, exercises}: MyTrainingRowProps ){

    const router = useRouter();

    const visibleExercises = useMemo(
        () => exercises.slice(0, 3),
        [exercises]
    );
    const remainingCount = exercises.length - visibleExercises.length;

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center">
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
                <div className="flex-row md:flex justify-end gap-3 md:col-span-2">
                    <div className="w-full flex flex-col gap-2">
                        <div className="text-sm font-medium text-emerald-900 mb-1">Упражнения</div>
                        <div className="flex flex-wrap gap-2">
                            {visibleExercises.map((exName, idx) => (
                                <span
                                    key={`${exName}-${idx}`}
                                    className="px-2 py-0.5 text-xs border rounded-full border-emerald-200 text-emerald-800 bg-emerald-50"
                                >
                                    {exName}
                                </span>
                            ))}
                            {remainingCount > 0 && (
                                <span className="px-2 py-0.5 text-xs border rounded-full border-emerald-200 text-emerald-700 bg-emerald-50">
                                    и ещё {remainingCount}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0">
                        <ChangeButton
                            onClick={useCallback(() => router.push(`/my-training/${publicId}`), [publicId, router])}
                            className={`w-full`}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default memo(MyTrainingRow);