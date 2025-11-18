import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/app/auth/login/Login';

const replaceMock = jest.fn();
const setServerErrorMock = jest.fn();

jest.mock('@/lib/hooks/usePageUtils', () => ({
	usePageUtils: () => ({
		serverError: null,
		setServerError: setServerErrorMock,
		isSubmitting: false,
		setIsSubmitting: jest.fn(),
		router: { replace: replaceMock },
	}),
}));

describe('Login', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Проверка работоспособности валидации', async () => {
		render(<Login />);

		const submitButton = screen.getByRole('button', { name: 'Войти' });
		await userEvent.click(submitButton);

		expect(await screen.findByText('Пожалуйста, введите ваш email')).toBeInTheDocument();
		expect(await screen.findByText('Пожалуйста, введите ваш пароль')).toBeInTheDocument();
	});

    it('Не успешная отправка формы из-за backend', async () => {
        // Эмулируем сетевую ошибку (бэкенд недоступен)
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<Login />);

        await userEvent.type(screen.getByPlaceholderText('Email'), 'awfw@b12.com');
        await userEvent.type(screen.getByPlaceholderText('Пароль'), '12345678');

        const submitButton = screen.getByRole('button', { name: 'Войти' });
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

		render(<Login />);

		await userEvent.type(screen.getByPlaceholderText('Email'), 'awfw@b12.com');
		await userEvent.type(screen.getByPlaceholderText('Пароль'), '12345678');

		const submitButton = screen.getByRole('button', { name: 'Войти' });
		await userEvent.click(submitButton);

		// Убедимся, что отправка произошла
		await waitFor(() => expect(global.fetch).toHaveBeenCalled());

		// Ждём вызов replace('/')
		await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
	});
});


