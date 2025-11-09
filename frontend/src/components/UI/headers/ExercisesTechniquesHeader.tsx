import FilterInput from "@/components/inputs/FilterInput";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

interface ExercisesTechniquesHeaderProps {
    searchName: string;
    onSearchChange: (value: string) => void;
}

export default function ExercisesTechniquesHeader({searchName, onSearchChange}: ExercisesTechniquesHeaderProps){

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Техника выполнения упражнений</h1>
                </div>

                <div className="w-full md:w-80">
                    <FilterInput
                        id="exercise-search"
                        label="Поиск по названию"
                        value={searchName}
                        onChange={onSearchChange}
                        placeholder="Например: Жим, Приседания..."
                        icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                    />
                </div>
            </div>
        </div>
    )
}