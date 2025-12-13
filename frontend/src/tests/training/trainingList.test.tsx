import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import Goals from "@/app/goals/Goals";
import MyTraining from "@/app/my-training/MyTraining";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import {TrainingListResponse} from "@/types/trainingTypes";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Список тренировок', () => {
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

    const trainingData:TrainingListResponse[] = [
        {
            id: 1,
            publicId: 'bc96f300-4af3-4e30-b74b-71e2b06f5c78',
            name: 'тренировка груди',
            description: 'обычная тренировка груди',
            exercises: [1],
        }
    ]

    it('Проверка корректного вывода данных списка', async () => {
        render(<MyTraining trainingList={trainingData} exercises={exercisesData}  />);

        expect(await screen.findByText('тренировка груди')).toBeInTheDocument();
        expect(await screen.findByText('обычная тренировка груди')).toBeInTheDocument();
        expect(await screen.findByText('Жим штанги лёжа')).toBeInTheDocument();
    });

    it('Отсутствие данных в списке, потому что пользователь еще не добавлял тренировку', async () => {
        render(<MyTraining trainingList={[]} exercises={[]}  />);

        expect(await screen.findByText('У вас пока нет созданных тренировок. Нажмите «Создать тренировку», чтобы создать первую.')).toBeInTheDocument();
    });

    it('Успешный переход к странице изменения тренировки', async () => {
        render(<MyTraining trainingList={trainingData} exercises={exercisesData}  />);

        const buttons = await screen.findAllByRole('button');
        const changeButton = buttons[buttons.length - 1];

        await userEvent.click(changeButton);

        expect(pushMock).toHaveBeenCalledWith(`/my-training/bc96f300-4af3-4e30-b74b-71e2b06f5c78`);
    });
});


