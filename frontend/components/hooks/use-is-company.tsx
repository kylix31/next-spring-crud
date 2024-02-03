import * as React from "react"
import { useParams } from "next/navigation"

/**
 * A custom React hook that determines if the current page is for a company.
 *
 * @returns {boolean} - Returns a boolean value indicating whether the current page is for a company.
 *
 * @throws {TypeError} - Throws a TypeError if the `useParams` hook returns `null` or `undefined`.
 */
export function useIsCompany(): boolean {
  const params = useParams()

  if (!params) {
    throw new TypeError("useParams returned null or undefined.")
  }

  return React.useMemo(
    () =>
      (params.type === "companies" && params.related !== "supplies") ||
      params.related === "company",
    [params.related, params.type]
  )
}
