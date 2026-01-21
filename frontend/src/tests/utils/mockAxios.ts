type AxiosMockFn = jest.Mock & {
	_mockType?: 'axios';
};

const createMockFn = (): AxiosMockFn => jest.fn() as AxiosMockFn;

export const mockAxiosInstance = {
	get: createMockFn(),
	post: createMockFn(),
	put: createMockFn(),
	delete: createMockFn(),
	patch: createMockFn(),
	request: createMockFn(),
	defaults: {},
	interceptors: {
		request: {
			use: createMockFn(),
			eject: createMockFn(),
		},
		response: {
			use: createMockFn(),
			eject: createMockFn(),
		},
	},
};

const mockAxios = {
	create: createMockFn().mockReturnValue(mockAxiosInstance),
	isAxiosError: (err: unknown) =>
		!!err && typeof err === 'object' && 'isAxiosError' in err,
	...mockAxiosInstance,
};

export default mockAxios;
