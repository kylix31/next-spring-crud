/**
 * Returns the backend path for the application.
 *
 * @returns {string} The backend path for the application.
 *
 * @throws {Error} If no backend path is found.
 */
export function backendPath(): string {
  /**
   * The backend path is determined by checking the following environment variables, in order:
   * 1. process.env.API_BASE
   * 2. process.env.NEXT_PUBLIC_API_BASE
   * If neither of these environment variables are set, the default value of "http://localhost:8080" is returned.
   */
  const backendPath =
    process.env.API_BASE ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "http://localhost:8080"

  if (!backendPath) {
    throw new Error("No backend path found.")
  }

  return backendPath
}
