import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Registration from "@/app/auth/registration/Registration";
import {
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import { replaceMock } from '@/tests/utils/mockNextNavigation';

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // Берём общий мок из утилит
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Registration', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    it('Проверка работоспособности валидации', async () => {
        render(<Registration />);

        const submitButton = screen.getByRole('button', { name: 'Зарегистрироваться' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите имя для вашего аккаунта')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите ваш email')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите ваш пароль')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, подтвердите ваш пароль')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        // Эмулируем сетевую ошибку (бэкенд недоступен)
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<Registration />);

        await userEvent.type(screen.getByPlaceholderText('Имя пользователя'), 'ryzigyjek');
        await userEvent.type(screen.getByPlaceholderText('Email'), 'awfw@b12.com');
        await userEvent.type(screen.getByPlaceholderText('Пароль'), '12345678');
        await userEvent.type(screen.getByPlaceholderText('Подтверждение пароля'), '12345678');

        const submitButton = screen.getByRole('button', { name: 'Зарегистрироваться' });
        await userEvent.click(submitButton);

        // Убедимся, что отправка произошла
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
        // Проверяем, что показана ошибка сетевой недоступности
        await waitFor(() =>
            expect(setServerErrorMock).toHaveBeenCalledWith(
                'Не удалось связаться с сервером. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'
            )
        );
    });


    it('Успешная отправка формы', async () => {
        // Мокаем fetch успешным ответом
        global.fetch = jest.fn().mockResolvedValue({ ok: true });

        render (<Registration />);

        await userEvent.type(screen.getByPlaceholderText('Имя пользователя'), 'ryzigyjek');
        await userEvent.type(screen.getByPlaceholderText('Email'), 'awfw@b12.com');
        await userEvent.type(screen.getByPlaceholderText('Пароль'), '12345678');
        await userEvent.type(screen.getByPlaceholderText('Подтверждение пароля'), '12345678');

        const submitButton = screen.getByRole('button', { name: 'Зарегистрироваться' });
        await userEvent.click(submitButton);

        // Убедимся, что отправка произошла
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        // Ждём вызов replace('/')
        await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
    });
});


