import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/app/auth/login/Login';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
	buildUsePageUtilsMock,
	resetUsePageUtilsOverrides,
	setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import { replaceMock } from '@/tests/utils/mockNextNavigation';
import { mockAxiosInstance } from '@/tests/utils/mockAxios';

const initUserDataMock = jest.fn().mockResolvedValue(undefined);

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
	...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

jest.mock('@/lib/store/userStore', () => ({
	useUserStore: Object.assign(
		(selector?: (state: { initUserData: () => Promise<void> }) => unknown) =>
			selector ? selector({ initUserData: initUserDataMock }) : { initUserData: initUserDataMock },
		{
			getState: () => ({ userData: { id: 'test-user' } }),
		}
	),
	makeInitUserData: (s: { initUserData: () => Promise<void> }) => s.initUserData,
}));

describe('Логин', () => {
	afterEach(() => {
		jest.clearAllMocks();
		resetUsePageUtilsOverrides();
	});

	it('Проверка работоспособности валидации', async () => {
		render(<Login />);

		const submitButton = screen.getByRole('button', { name: 'Войти' });
		await userEvent.click(submitButton);

		expect(await screen.findByText('Пожалуйста, введите имя пользователя')).toBeInTheDocument();
		expect(await screen.findByText('Пожалуйста, введите ваш пароль')).toBeInTheDocument();
	});

    it('Не успешная отправка формы из-за backend', async () => {
        mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

        render(<Login />);

        await userEvent.type(screen.getByLabelText('Имя пользователя'), 'testuser123');
        await userEvent.type(screen.getByLabelText('Пароль'), '12345678');

        const submitButton = screen.getByRole('button', { name: 'Войти' });
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

		render(<Login />);

        await userEvent.type(screen.getByLabelText('Имя пользователя'), 'testuser123');
		await userEvent.type(screen.getByLabelText('Пароль'), '12345678');

		const submitButton = screen.getByRole('button', { name: 'Войти' });
		await userEvent.click(submitButton);

		await waitFor(() => expect(mockAxiosInstance.post).toHaveBeenCalled());

		await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
	});
});


