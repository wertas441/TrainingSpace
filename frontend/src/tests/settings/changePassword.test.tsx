import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
    setServerErrorMock,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import ChangePassword from "@/app/settings/change-password/ChangePassword";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Смена пароля', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    it('Проверка работоспособности валидации', async () => {
        render(<ChangePassword />);

        const submitButton = screen.getByRole('button', { name: 'Сменить пароль' });
        await userEvent.click(submitButton);

        expect(await screen.findByText('Пожалуйста, введите ваш пароль')).toBeInTheDocument();
        expect(await screen.findByText('Ваш новый пароль такой же как и нынешний')).toBeInTheDocument();
        expect(await screen.findByText('Пожалуйста, подтвердите ваш пароль')).toBeInTheDocument();
    });

    it('Не успешная отправка формы из-за backend', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<ChangePassword />);

        await userEvent.type(screen.getByLabelText('Ваш текущий пароль'), '123123Gbhy!');
        await userEvent.type(screen.getByLabelText('Новый пароль'), '123123gbhy');
        await userEvent.type(screen.getByLabelText('Подтверждение нового пароля'), '123123gbhy');

        const submitButton = screen.getByRole('button', { name: 'Сменить пароль' });
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

        render(<ChangePassword />);

        await userEvent.type(screen.getByLabelText('Ваш текущий пароль'), '123123Gbhy!');
        await userEvent.type(screen.getByLabelText('Новый пароль'), '123123gbhy');
        await userEvent.type(screen.getByLabelText('Подтверждение нового пароля'), '123123gbhy');

        const submitButton = screen.getByRole('button', { name: 'Сменить пароль' });
        await userEvent.click(submitButton);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/settings/profile'));
    });
});


