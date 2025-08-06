// Type for the [error, result] tuple with discriminated union
// Success: [null, T]
// Failure: [E, null]
type GoResult<T, E = Error> = [E, null] | [null, T];

/**
 * Wraps a promise in a try/catch block and returns a Go-style [error, result] tuple.
 * @param promise The promise to execute.
 * @returns A promise that resolves to a tuple: [error, null] on failure, or [null, result] on success.
 */
export async function go<T, E = Error>(
  promise: Promise<T>,
): Promise<GoResult<T, E>> {
  try {
    const data = await promise;
    // On success, return a tuple with null for the error and the data as the result.
    return [null, data];
  } catch (error) {
    // On failure, return a tuple with the error and null for the data.
    return [error as E, null];
  }
}