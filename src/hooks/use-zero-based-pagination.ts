import { useCallback, useState } from "react";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface PaginationParams {
  newPageIndex: number;
  newPageSize: number;
}

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

export const useZeroBasedPagination = (
  initialPageIndex: number = DEFAULT_PAGE_INDEX,
  initialPageSize: number = DEFAULT_PAGE_SIZE,
) => {
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });

  const setPagination = useCallback(
    ({ newPageIndex, newPageSize }: PaginationParams) => {
      setPaginationState({ pageIndex: newPageIndex, pageSize: newPageSize });
    },
    [],
  );

  const resetPagination = useCallback(() => {
    setPaginationState({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  return {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    setPagination,
    resetPagination,
  };
};
