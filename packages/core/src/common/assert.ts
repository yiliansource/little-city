/**
 * Asserts that a value is not `undefined`.
 */
export function assertDefined<T>(val: T, message?: string): asserts val is Exclude<T, undefined> {
	if (val === undefined) {
		throw new Error(message ?? "value is undefined");
	}
}

/**
 * Asserts that a value is not `null`.
 */
export function assertNonNull<T>(val: T, message?: string): asserts val is Exclude<T, null> {
	if (val === null) {
		throw new Error(message ?? "value is null");
	}
}

/**
 * Asserts that a value is handled exhaustive, in other words the code path is unreachable.
 */
export function assertUnreachable(value: never): never {
	throw new Error(`Unreachable case: ${JSON.stringify(value)}`);
}
