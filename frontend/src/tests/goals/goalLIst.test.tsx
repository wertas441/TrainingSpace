import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildUsePageUtilsMock,
    resetUsePageUtilsOverrides,
} from '@/tests/utils/mockUsePageUtils';
import {pushMock} from '@/tests/utils/mockNextNavigation';
import {GoalsStructure} from "@/types/goalTypes";
import Goals from "@/app/goals/Goals";

jest.mock('@/lib/hooks/usePageUtils', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('@/tests/utils/mockUsePageUtils').buildUsePageUtilsMock(),
}));

describe('Список целей во вкладке "Цели"', () => {
    afterEach(() => {
        jest.clearAllMocks();
        resetUsePageUtilsOverrides();
    });

    const clientGoalsFakeData: GoalsStructure[] = [
        {
            id: 3,
            name: 'Купить яйца',
            description: 'Надо пожать сотку и купить ящик',
            priority: 'Низкий',
        },
        {
            id: 6,
            name: 'Пожать 200 ногами',
            description: '',
            priority: 'Высокий',
        },
        {
            id: 7,
            name: 'Сделать 100 подтягиваний',
            description: 'сделать 100 подтягиваний широким хватом',
            priority: 'Средний',
        },
    ]

    it('Проверка корректного вывода данных списка', async () => {
        render(<Goals clientGoals={clientGoalsFakeData} />);

        expect(await screen.findByText('Купить яйца')).toBeInTheDocument();
        expect(await screen.findByText('Надо пожать сотку и купить ящик')).toBeInTheDocument();
        expect(await screen.findByText('Низкий')).toBeInTheDocument();
        expect(await screen.findByText('Пожать 200 ногами')).toBeInTheDocument();
        expect(await screen.findByText('Высокий')).toBeInTheDocument();
        expect(await screen.findByText('Сделать 100 подтягиваний')).toBeInTheDocument();
        expect(await screen.findByText('Средний')).toBeInTheDocument();
    });

    it('Отсутствие данных в списке, потому что пользователь еще не добавлял цель', async () => {
        render(<Goals clientGoals={[]} />);

        expect(await screen.findByText('У вас пока нет активных целей. Нажмите «Добавить цель», чтобы создать первую.')).toBeInTheDocument();
    });

    it('Успешный переход к странице изменения цели', async () => {
        render(<Goals clientGoals={clientGoalsFakeData} />);

        const buttons = await screen.findAllByRole('button');
        const changeButton = buttons[buttons.length - 1];

        await userEvent.click(changeButton);

        expect(pushMock).toHaveBeenCalledWith(`/goals/${7}`);
    });
});


