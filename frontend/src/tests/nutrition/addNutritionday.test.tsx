import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import AddNutrition from "@/app/nutrition/add/AddNutrition";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Добавить новый день для отслеживания', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    it('Проверка работоспособности валидации', async () => {
        render(<AddNutrition />);

        const dataInput = screen.getByLabelText('Дата')
        await userEvent.clear(dataInput);

        const submitButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите имя для дня')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Калории"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Белки (г)"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Жиры (г)"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Углеводы (г)"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, выберите дату')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<AddNutrition />);

        await userEvent.type(screen.getByLabelText('Имя дня'), 'хороший день');
        await userEvent.type(screen.getByLabelText('Калории (ккал)'), '4200');
        await userEvent.type(screen.getByLabelText('Белки (г)'), '150');
        await userEvent.type(screen.getByLabelText('Жиры (г)'), '140');
        await userEvent.type(screen.getByLabelText('Углеводы (г)'), '300');
        
        const dateInput = screen.getByLabelText('Дата');
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, '2025-08-27');

        const submitButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        await waitFor(() =>
            expect(setServerErrorMock).toHaveBeenCalledWith(
                'Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'
            )
        );
    });


    it('Успешная отправка формы', async () => {

        global.fetch = jest.fn().mockResolvedValue({ ok: true });

        render(<AddNutrition />);

        await userEvent.type(screen.getByLabelText('Имя дня'), 'хороший день');
        await userEvent.type(screen.getByLabelText('Калории (ккал)'), '4200');
        await userEvent.type(screen.getByLabelText('Белки (г)'), '150');
        await userEvent.type(screen.getByLabelText('Жиры (г)'), '140');
        await userEvent.type(screen.getByLabelText('Углеводы (г)'), '300');
        
        const dateInput = screen.getByLabelText('Дата');
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, '2025-08-27');

        const submitButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/nutrition'));
    });
});


