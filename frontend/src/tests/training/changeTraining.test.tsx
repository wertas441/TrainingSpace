import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {replaceMock} from '@/tests/utils/mockNextNavigation';
import {ExerciseTechniqueItem} from "@/types/exercisesTechniquesTypes";
import ChangeTraining from "@/app/my-training/[trainingId]/ChangeTraining";
import {TrainingListResponse} from "@/types/trainingTypes";
import { mockAxiosInstance } from '@/tests/utils/mockAxios';

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Изменить тренировку', () => {
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

    const trainingData:TrainingListResponse = {
        id: 1,
        publicId: 'bc76f322-4af3-4e30-b74b-71e2b06f5c78',
        name: 'первая тренировка',
        description: 'моя первая тренировка в зале',
        exercises: [1]
    }

    it('Проверка работоспособности валидации', async () => {
        render(<ChangeTraining trainingInfo={trainingData} token={'test-token'} exercises={exercisesData} />);

        const nameInput = screen.getByLabelText('Название тренировки');
        await userEvent.clear(nameInput);

        const removeButton = screen.getByRole('button', { name: 'Убрать' });
        await userEvent.click(removeButton);

        const submitButton = screen.getByRole('button', { name: 'Изменить' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите имя тренировки')).toBeInTheDocument();
        expect(await screen.findByText('Добавьте хотя бы одно упражнение в тренировку')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        mockAxiosInstance.put.mockRejectedValue(new Error('Network error'));

        render(<ChangeTraining trainingInfo={trainingData} token={'test-token'} exercises={exercisesData} />);

        const submitButton = screen.getByRole('button', { name: 'Изменить' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(mockAxiosInstance.put).toHaveBeenCalled());

        await waitFor(() =>
            expect(setServerErrorMock).toHaveBeenCalledWith(
                'Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'
            )
        );
    });


    it('Успешная отправка формы', async () => {
        mockAxiosInstance.put.mockResolvedValue({ data: { success: true } });
      
        render(<ChangeTraining trainingInfo={trainingData} token={'test-token'} exercises={exercisesData} />);
      
        const nameInput = screen.getByLabelText('Название тренировки');
        await userEvent.clear(nameInput);                          
        await userEvent.type(nameInput, 'тренировка на грудь');
      
        const submitButton = screen.getByRole('button', { name: 'Изменить' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(mockAxiosInstance.put).toHaveBeenCalled());

        await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/my-training'));
      });
});


