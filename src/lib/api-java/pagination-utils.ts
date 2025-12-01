/**
 * Pagination utilities for Java Spring Boot backend integration.
 * 
 * The backend uses Spring Data with `one-indexed-parameters=true`, meaning:
 * - API expects page numbers starting from 1 (1-indexed)
 * - API returns page.number starting from 0 (0-indexed)
 * 
 * TanStack Table uses 0-indexed pagination internally.
 * These utilities handle the conversion between both systems.
 */

/**
 * Converts frontend 0-indexed page to backend 1-indexed page.
 * Use this when sending pagination params to the API.
 * 
 * @param pageIndex - The 0-indexed page from TanStack Table
 * @returns The 1-indexed page for the backend API
 * 
 * @example
 * // Frontend pageIndex = 0 -> API page = 1
 * // Frontend pageIndex = 1 -> API page = 2
 * const apiPage = toApiPage(pageIndex);
 */
export const toApiPage = (pageIndex: number): number => {
  return pageIndex + 1;
};

/**
 * Converts backend 0-indexed page.number to frontend pageIndex.
 * Use this when processing pagination metadata from the API response.
 * 
 * @param pageNumber - The page.number from Spring Data response (0-indexed)
 * @returns The pageIndex for TanStack Table (0-indexed)
 * 
 * @example
 * // API page.number = 0 -> Frontend pageIndex = 0
 * // API page.number = 1 -> Frontend pageIndex = 1
 * const pageIndex = toPageIndex(response.page.number);
 */
export const toPageIndex = (pageNumber: number): number => {
  return pageNumber;
};

/**
 * Creates the pagination request DTO for the Java backend.
 * Automatically converts 0-indexed pageIndex to 1-indexed page.
 * 
 * @param pageIndex - The 0-indexed page from TanStack Table
 * @param pageSize - The number of items per page
 * @returns The pagination request object ready for the API
 * 
 * @example
 * const query = backendJava.useQuery("get", "/endpoint/paginated", {
 *   params: {
 *     query: {
 *       requestDto: createPaginationRequestDto(pageIndex, pageSize),
 *     },
 *   },
 * });
 */
export const createPaginationRequestDto = (
  pageIndex: number,
  pageSize: number,
): { page: number; size: number } => {
  return {
    page: toApiPage(pageIndex),
    size: pageSize,
  };
};

/**
 * Type for pagination request parameters
 */
export type PaginationRequestDto = ReturnType<typeof createPaginationRequestDto>;
