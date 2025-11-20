import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import AddGoal from "@/app/goals/add/AddGoal";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Добавить новую цель', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    it('Проверка работоспособности валидации', async () => {
        render(<AddGoal />);

        const submitButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите название цели')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<AddGoal />);

        await userEvent.type(screen.getByLabelText('Название цели'), 'пожать 100кг');
        await userEvent.type(screen.getByLabelText('Описание'), 'фыыфацйайай');

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

        render(<AddGoal />);

        await userEvent.type(screen.getByLabelText('Название цели'), 'пожать 100кг');
        await userEvent.type(screen.getByLabelText('Описание'), 'фыыфацйайай');

        const submitButton = screen.getByRole('button', { name: 'Добавить' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/goals'));
    });
});


