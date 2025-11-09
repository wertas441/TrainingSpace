import FilterInput from "@/components/inputs/FilterInput";
import {CalendarIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import LightGreenLinkBtn from "@/components/buttons/LightGreenBtn/LightGreenLinkBtn";

interface NutritionHeaderProps {
    searchName?: string;
    onSearchNameChange?: (newValue: string) => void;
    searchDate?: string; // формат YYYY-MM-DD
    onSearchDateChange?: (newValue: string) => void;
}

export default function NutritionHeader({searchName = '', onSearchNameChange, searchDate = '', onSearchDateChange,}: NutritionHeaderProps) {

    return (
        <div className="w-full bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-emerald-800">Питание</h1>
                </div>

                <div className="w-full md:max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FilterInput
                            id="nutrition-search-name"
                            placeholder="Поиск по названию дня"
                            value={searchName}
                            onChange={(v) => onSearchNameChange && onSearchNameChange(v)}
                            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                        />

                        <FilterInput
                            id="nutrition-search-date"
                            type="date"
                            placeholder="Дата"
                            value={searchDate}
                            onChange={(v) => onSearchDateChange && onSearchDateChange(v)}
                            icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <LightGreenLinkBtn
                        label="Добавить день"
                        href={'/nutrition/add'}
                        className="md:w-auto px-5"
                    />
                </div>
            </div>
        </div>
    )
}