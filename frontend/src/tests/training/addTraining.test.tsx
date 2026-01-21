import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import AddNewTraining from "@/app/my-training/add/AddNewTraining";
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import { mockAxiosInstance } from '@/tests/utils/mockAxios';

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Добавить новую тренировку', () => {
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
    ]

    it('Проверка работоспособности валидации', async () => {
        render(<AddNewTraining exercises={exercisesData}  />);

        const submitButton = screen.getByRole('button', { name: 'Добавить тренировку' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите имя тренировки')).toBeInTheDocument();
        expect(await screen.findByText('Добавьте хотя бы одно упражнение в тренировку')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

        render(<AddNewTraining exercises={exercisesData}  />);

        await userEvent.type(screen.getByLabelText('Название тренировки'), 'тренировка на грудь');

        const addButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(addButton);

        const submitButton = screen.getByRole('button', { name: 'Добавить тренировку' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(mockAxiosInstance.post).toHaveBeenCalled());

        await waitFor(() =>
            expect(setServerErrorMock).toHaveBeenCalledWith(
                'Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'
            )
        );
    });


    it('Успешная отправка формы', async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

        render(<AddNewTraining exercises={exercisesData}  />);

        await userEvent.type(screen.getByLabelText('Название тренировки'), 'тренировка на грудь');

        const addButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(addButton);

        const submitButton = screen.getByRole('button', { name: 'Добавить тренировку' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(mockAxiosInstance.post).toHaveBeenCalled());

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/my-training'));
    });
});


