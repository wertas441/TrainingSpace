import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import ChangeEmail from "@/app/settings/change-email/ChangeEmail";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Смена почты', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    it('Проверка работоспособности валидации', async () => {
        render(<ChangeEmail />);

        const submitButton = screen.getByRole('button', { name: 'Сменить почту' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите ваш email')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, введите ваш пароль')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<ChangeEmail />);

        await userEvent.type(screen.getByLabelText('Новая почта'), 'gewr331@gmail.com');
        await userEvent.type(screen.getByLabelText('Ваш текущий пароль'), '123123Gbhy!');

        const submitButton = screen.getByRole('button', { name: 'Сменить почту' });
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

        render(<ChangeEmail />);

        await userEvent.type(screen.getByLabelText('Новая почта'), 'gewr331@gmail.com');
        await userEvent.type(screen.getByLabelText('Ваш текущий пароль'), '123123Gbhy!');

        const submitButton = screen.getByRole('button', { name: 'Сменить почту' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/settings/profile'));
    });
});


