import {render, screen} from '@testing-library/react';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
} from '@/tests/utils/mockUsePageUtils';
import Profile from "@/app/settings/profile/Profile";
import type {UserProfileRequest} from "@/types";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Пользовательский профиль', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    const userData:UserProfileRequest = {
        publicId: '13ddb945-2cbf-7bdc-adec-ce4cca33558f',
        email: 'testuser123@gmail.com',
        userName: 'testuser123',
        createdAt: '2025-12-04T00:00:00.000Z',
    }

    it('Проверка корректного получения и отображения данных', async () => {
        render(<Profile userData={userData} />);

        expect(await screen.findByText('13ddb945-2cbf-7bdc-adec-ce4cca33558f')).toBeInTheDocument();
        expect(await screen.findByText('testuser123')).toBeInTheDocument();
        expect(await screen.findByText('testuser123@gmail.com')).toBeInTheDocument();
        expect(await screen.findByText('С нами с 04 декабря 2025 г.')).toBeInTheDocument();
    });
});


