import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import {NutritionDay} from "@/types/nutritionTypes";
import Nutrition from "@/app/nutrition/Nutrition";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Список дней во вкладке "Питание"', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    const testId = 1;
    const testName = 'Крутой день';
    const testDate = '27.02.2025';
    const testDescription = 'fqfwefwefwewegewgwegwegweg'
    const testCalories = 2320;
    const testProtein = 135;
    const testFat = 70;
    const testCarb = 250;

    const testData: NutritionDay[] = [
        {
            id: testId,
            name: testName,
            date: testDate,
            description: testDescription,
            calories: testCalories,
            protein: testProtein,
            fat: testFat,
            carb: testCarb,
        },
    ]

    it('Проверка корректного вывода данных списка', async () => {
        render(<Nutrition userDays={testData} />);

        expect(await screen.findByText(testId)).toBeInTheDocument();
        expect(await screen.findByText(testName)).toBeInTheDocument();
        expect(await screen.findByText(testDate)).toBeInTheDocument();
        expect(await screen.findByText(testDescription)).toBeInTheDocument();
        expect(await screen.findByText(testCalories)).toBeInTheDocument();
        expect(await screen.findByText(testProtein)).toBeInTheDocument();
        expect(await screen.findByText(testFat)).toBeInTheDocument();
        expect(await screen.findByText(testCarb)).toBeInTheDocument();
    });

    it('Отсутствие данные в списке из-за сетевой ошибки или пользователь еще не добавлял день', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<Nutrition userDays={testData} />);

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

        render(<Nutrition userDays={testData} />);

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


