import {render, screen} from '@testing-library/react';
import {
    resetUsePageUtilsOverrides,
} from '@/tests/utils/mockUsePageUtils';
import {ExerciseTechniqueItem} from "@/types/exercisesTechniques";
import ExercisesTechniques from "@/app/exercises-techniques/ExercisesTechniques";
import QueryProvider from "@/lib/utils/QueryProvider";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Список упражнений', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    const exercisesData:ExerciseTechniqueItem[] = [
        {
            id: 1,
            name: 'Жим штанги лёжа',
            difficulty: 'Средний',
            description: 'Лягте на скамью, стопы прижаты к полу, лопатки сведены, поясница в естественном прогибе. Опускайте штангу к нижней части груди с контролем и выжимайте вверх без отрыва таза. Избегайте отбивания от груди и разведения локтей слишком широко.',
            partOfTheBody: ['Грудь', 'Передние дельты', 'Трицепс']
        },
    ];

    it('Проверка корректного вывода данных списка', async () => {
        render(
            <QueryProvider>
                <ExercisesTechniques initialExercises={exercisesData} />
            </QueryProvider>
        );

        expect(await screen.findByText('Жим штанги лёжа')).toBeInTheDocument();
        expect(await screen.findByText('Средний')).toBeInTheDocument();
        expect(await screen.findByText('Лягте на скамью, стопы прижаты к полу, лопатки сведены, поясница в естественном прогибе. Опускайте штангу к нижней части груди с контролем и выжимайте вверх без отрыва таза. Избегайте отбивания от груди и разведения локтей слишком широко.')).toBeInTheDocument();
        expect(await screen.findByText('Грудь')).toBeInTheDocument();
    });
});


