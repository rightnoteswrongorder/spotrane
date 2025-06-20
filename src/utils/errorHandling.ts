/**
 * A structured approach to handle errors in async operations
 * 
 * @template T The result type of the operation
 * @param promise The promise to execute
 * @returns A tuple with [data, error]
 */
export async function safeAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Wraps an async function with error handling
 * 
 * @template T The result type
 * @template Args The argument types
 * @param fn The async function to wrap
 * @returns A function that returns a tuple of [result, error]
 */
export function createSafeAsyncFunction<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<[T | null, Error | null]> {
  return async (...args: Args) => {
    return safeAsync(fn(...args));
  };
}

/**
 * Utility to log errors in a standardized way
 * 
 * @param context The context where the error occurred
 * @param error The error object
 * @param additionalInfo Optional additional information
 */
export function logError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`Error in ${context}:`, {
    message: errorMessage,
    stack: errorStack,
    ...additionalInfo
  });
}
