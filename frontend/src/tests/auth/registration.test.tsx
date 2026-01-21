import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Registration from "@/app/auth/registration/Registration";
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import { mockAxiosInstance } from '@/tests/utils/mockAxios';

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Регистрация', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    it('Проверка работоспособности валидации', async () => {

        render(<Registration />);

        const submitButton = screen.getByRole('button', { name: 'Зарегистрироваться' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите имя пользователя')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите ваш email')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите ваш пароль')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, подтвердите ваш пароль')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

        render(<Registration />);

        await userEvent.type(screen.getByLabelText('Имя пользователя'), 'ryzigyjek');
        await userEvent.type(screen.getByLabelText('Email'), 'awfw@b12.com');
        await userEvent.type(screen.getByLabelText('Пароль'), '12345678');
        await userEvent.type(screen.getByLabelText('Подтверждение пароля'), '12345678');

        const submitButton = screen.getByRole('button', { name: 'Зарегистрироваться' });
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

        render (<Registration />);

        await userEvent.type(screen.getByLabelText('Имя пользователя'), 'ryzigyjek');
        await userEvent.type(screen.getByLabelText('Email'), 'awfw@b12.com');
        await userEvent.type(screen.getByLabelText('Пароль'), '12345678');
        await userEvent.type(screen.getByLabelText('Подтверждение пароля'), '12345678');

        const submitButton = screen.getByRole('button', { name: 'Зарегистрироваться' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(mockAxiosInstance.post).toHaveBeenCalled());

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/auth/login'));
    });
});


