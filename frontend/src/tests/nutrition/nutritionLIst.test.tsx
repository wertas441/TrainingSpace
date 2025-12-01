import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
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

        expect(await screen.findByText(testName)).toBeInTheDocument();
        expect(await screen.findByText(testDate)).toBeInTheDocument();
        expect(await screen.findByText(testDescription)).toBeInTheDocument();
        expect(await screen.findByText(testCalories)).toBeInTheDocument();
        expect(await screen.findByText(`${testProtein}`)).toBeInTheDocument();
        expect(await screen.findByText(`${testFat}`)).toBeInTheDocument();
        expect(await screen.findByText(`${testCarb}`)).toBeInTheDocument();
    });

    it('Отсутствие данных в списке из-за сетевой ошибки или пользователь еще не добавлял день', async () => {
        render(<Nutrition userDays={[]} />);

        expect(await screen.findByText('Добавленных дней не найдено, попробуйте изменить фильтры и проверить подключение к сети.')).toBeInTheDocument();
    });

    it('Успешный переход к странице изменения дня', async () => {
        render(<Nutrition userDays={testData} />);

        const buttons = await screen.findAllByRole('button');
        const changeButton = buttons[buttons.length - 1];

        await userEvent.click(changeButton);

        expect(pushMock).toHaveBeenCalledWith(`/nutrition/${testId}`);
    });
});


