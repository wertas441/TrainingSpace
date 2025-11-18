// Enable jest-dom matchers (toBeInTheDocument, etc.)
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('@testing-library/jest-dom');

// Глобальный мок next/navigation
// eslint-disable-next-line @typescript-eslint/no-require-imports
const navMockUtils = require('./src/tests/utils/mockNextNavigation');
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('next/navigation', () => navMockUtils.buildNextNavigationMock());

afterEach(() => {
	navMockUtils.resetNextNavigationOverrides();
});


