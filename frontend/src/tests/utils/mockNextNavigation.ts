export type Router = {
	push: (path: string) => void;
	replace: (path: string) => void;
	prefetch: (path: string) => Promise<void>;
	refresh: () => void;
	back: () => void;
	forward: () => void;
};

export const pushMock = jest.fn();
export const replaceMock = jest.fn();
export const prefetchMock = jest.fn().mockResolvedValue(undefined);
export const refreshMock = jest.fn();
export const backMock = jest.fn();
export const forwardMock = jest.fn();

let pathname = '/';
let searchParams = new URLSearchParams();
let routerOverrides: Partial<Router> = {};

export const setNextNavigationPathname = (p: string) => {
	pathname = p;
};

export const setNextNavigationSearchParams = (sp: URLSearchParams) => {
	searchParams = sp;
};

export const setNextNavigationOverrides = (o: Partial<Router>) => {
	routerOverrides = o;
};

export const resetNextNavigationOverrides = () => {
	pushMock.mockClear();
	replaceMock.mockClear();
	prefetchMock.mockClear();
	refreshMock.mockClear();
	backMock.mockClear();
	forwardMock.mockClear();
	routerOverrides = {};
	pathname = '/';
	searchParams = new URLSearchParams();
};

export const buildNextNavigationMock = () => ({
	useRouter: (): Router => ({
		push: pushMock,
		replace: replaceMock,
		prefetch: prefetchMock,
		refresh: refreshMock,
		back: backMock,
		forward: forwardMock,
		...routerOverrides,
	}),
	usePathname: () => pathname,
	useSearchParams: () => searchParams,
});


