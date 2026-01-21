// Enable jest-dom matchers (toBeInTheDocument, etc.)
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('@testing-library/jest-dom');

// Глобальный мок next/navigation
// eslint-disable-next-line @typescript-eslint/no-require-imports
const navMockUtils = require('./src/tests/utils/mockNextNavigation');

jest.mock('next/navigation', () => navMockUtils.buildNextNavigationMock());

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('axios', () => require('./src/tests/utils/mockAxios'));

const resetAxiosMocks = () => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const { mockAxiosInstance } = require('./src/tests/utils/mockAxios');
	if (!mockAxiosInstance) return;

	const resetMaybeMock = (value) => {
		if (value && typeof value.mockReset === 'function') {
			value.mockReset();
		}
	};

	Object.values(mockAxiosInstance).forEach(resetMaybeMock);
	resetMaybeMock(mockAxiosInstance.interceptors?.request?.use);
	resetMaybeMock(mockAxiosInstance.interceptors?.request?.eject);
	resetMaybeMock(mockAxiosInstance.interceptors?.response?.use);
	resetMaybeMock(mockAxiosInstance.interceptors?.response?.eject);
	resetMaybeMock(require('./src/tests/utils/mockAxios').default?.create);
};

afterEach(() => {
	navMockUtils.resetNextNavigationOverrides();
	resetAxiosMocks();
});


