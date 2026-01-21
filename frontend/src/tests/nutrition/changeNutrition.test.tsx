import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {replaceMock} from '@/tests/utils/mockNextNavigation';
import ChangeNutrition from "@/app/nutrition/[nutritionId]/ChangeNutrition";
import {NutritionDay} from "@/types/nutritionTypes";
import {mockAxiosInstance} from "@/tests/utils/mockAxios";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Изменить день питания', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    const dayData:NutritionDay = {
		id: 1,
		publicId: 'f0d730b6-360d-4123-ab53-31155cf09ea2',
		name: 'чит мил день',
		date: '2025-12-12',
		description: 'кушаю что хочу',
		calories: 3000,
		protein: 140 ,
		fat: 90,
		carb: 400,
	}

    it('Проверка работоспособности валидации', async () => {
        render(<ChangeNutrition dayInfo={dayData} token={"test-token"}  />);

        const nameInput = screen.getByLabelText('Наименование дня');
        await userEvent.clear(nameInput);

        const calInput = screen.getByLabelText('Калории (ккал)');
        await userEvent.clear(calInput);

        const proteinInput = screen.getByLabelText('Белки (г)');
        await userEvent.clear(proteinInput);

        const fatInput = screen.getByLabelText('Жиры (г)');
        await userEvent.clear(fatInput);

        const carbInput = screen.getByLabelText('Углеводы (г)');
        await userEvent.clear(carbInput);

        const dateInput = screen.getByLabelText('Дата');
        await userEvent.clear(dateInput);

        const descrInput = screen.getByLabelText('Описание');
        await userEvent.clear(descrInput);

        const submitButton = screen.getByRole('button', { name: 'Изменить' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите наименование для дня')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Калории"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Белки (г)"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Жиры (г)"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите значение для поля "Углеводы (г)"')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, выберите дату')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        mockAxiosInstance.put.mockRejectedValue(new Error('Network error'));

        render(<ChangeNutrition dayInfo={dayData} token={"test-token"}  />);

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

        render(<ChangeNutrition dayInfo={dayData} token={"test-token"}  />);

        const nameInput = screen.getByLabelText('Наименование дня');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'обычный день');

        const submitButton = screen.getByRole('button', { name: 'Изменить' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(mockAxiosInstance.put).toHaveBeenCalled());

        await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/nutrition'));
    });
});


