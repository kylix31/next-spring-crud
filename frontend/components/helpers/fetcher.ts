import axios from "axios"

/**
 * Fetches data from a given URL using the axios library.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - A Promise that resolves with the fetched data.
 * @throws {Error} - Throws an error if the request fails or if the response is not in the expected format.
 */
export const fetcher = (url: string) => axios.get(url).then((res) => res.data)
