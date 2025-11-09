'use client'

import ExercisesTechniquesHeader from "@/components/UI/headers/ExercisesTechniquesHeader";
import {useMemo, useState} from "react";
import {exercises} from "@/lib/data/exercises";
import ExerciseRow from "@/components/elements/ExerciseRow";

export default function ExercisesTechniques() {

    const [searchName, setSearchName] = useState<string>('');

    const filteredExercises = useMemo(() => {
        if (!searchName) return exercises;
        const q = searchName.toLowerCase().trim();
        return exercises.filter(e => e.name.toLowerCase().includes(q));
    }, [searchName]);

    return (
        <div className="space-y-4">
            <ExercisesTechniquesHeader
                searchName={searchName}
                onSearchChange={setSearchName}
            />

            <div className="grid grid-cols-1 gap-3">
                {filteredExercises.length > 0 ? (
                    filteredExercises.map(ex => (
                            <ExerciseRow key={ex.id} exercise={ex} />
                        )
                    )
                ) : (
                    <div className="w-full rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                        Ничего не найдено. Попробуйте изменить запрос.
                    </div>
                )}
            </div>
        </div>
    );
}