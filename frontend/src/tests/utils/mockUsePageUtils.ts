import {
	Router,
	backMock,
	forwardMock,
	prefetchMock,
	pushMock,
	replaceMock,
	refreshMock,
} from '@/tests/utils/mockNextNavigation';

type UsePageUtils = {
	serverError: string | null;
	setServerError: (msg: string | null) => void;
	isSubmitting: boolean;
	setIsSubmitting: (v: boolean) => void;
	router: Router;
};

export const setServerErrorMock = jest.fn();

const defaultUsePageUtils: UsePageUtils = {
	serverError: null,
	setServerError: setServerErrorMock,
	isSubmitting: false,
	setIsSubmitting: jest.fn(),
	router: {
		push: pushMock,
		replace: replaceMock,
		prefetch: prefetchMock,
		refresh: refreshMock,
		back: backMock,
		forward: forwardMock,
	},
};

let overrides: Partial<UsePageUtils> = {};

export const setUsePageUtilsOverrides = (o: Partial<UsePageUtils>) => {
	overrides = o;
};

export const resetUsePageUtilsOverrides = () => {
	overrides = {};
};

export const buildUsePageUtilsMock = () => ({
	usePageUtils: () => ({ ...defaultUsePageUtils, ...overrides }),
});


