import { beforeEach, describe, expect, test, vi } from "vitest";
import {
	GET_CURRENT_USER_MUTATION_KEY,
	useGetCurrentUser,
} from "@/hooks/auth/useGetCurrentUser";

const apiMocks = vi.hoisted(() => ({
	getCurrentUserRequest: vi.fn(),
}));

vi.mock("@/api/user", () => ({
	getCurrentUserRequest: apiMocks.getCurrentUserRequest,
}));

const reactQueryMocks = vi.hoisted(() => {
	const mutationResult = {
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
	};
	let lastConfig: unknown;

	const useMutation = vi.fn((config: unknown) => {
		lastConfig = config;

		return mutationResult;
	});
	const getLastConfig = () => lastConfig;
	const reset = () => {
		lastConfig = undefined;
		mutationResult.mutate.mockClear();
		mutationResult.mutateAsync.mockClear();
	};

	return {
		getLastConfig,
		mutationResult,
		reset,
		useMutation,
	};
});

vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
		"@tanstack/react-query",
	);

	return {
		...actual,
		useMutation: reactQueryMocks.useMutation,
	};
});

type MutationConfig = {
	mutationFn?: () => Promise<unknown>;
	mutationKey?: unknown;
};

const getMutationConfig = () =>
	reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useGetCurrentUser", () => {
	const invokeHook = useGetCurrentUser as unknown as () =>
		typeof reactQueryMocks.mutationResult;

	beforeEach(() => {
		apiMocks.getCurrentUserRequest.mockReset();
		reactQueryMocks.useMutation.mockClear();
		reactQueryMocks.reset();
	});

	runTest("uses getCurrentUserRequest as mutation function", async () => {
		const response = { id: "user-1" };

		apiMocks.getCurrentUserRequest.mockResolvedValue(response);

		const mutation = invokeHook();

		expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

		const config = getMutationConfig();

		expect(config?.mutationKey).toEqual(GET_CURRENT_USER_MUTATION_KEY);
		expect(config?.mutationFn).toBeDefined();

		const result = await config?.mutationFn?.();

		expect(apiMocks.getCurrentUserRequest).toHaveBeenCalledWith();
		expect(result).toBe(response);
		expect(mutation).toBe(reactQueryMocks.mutationResult);
	});

	runTest("forwards errors from getCurrentUserRequest", async () => {
		const error = new Error("fail");

		apiMocks.getCurrentUserRequest.mockRejectedValue(error);

		invokeHook();

		const config = getMutationConfig();

		await expect(config?.mutationFn?.()).rejects.toBe(error);
	});
});
