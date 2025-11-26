import {
  ServerPaginationChangeEventCallback,
  ServerPaginationTanstackTableConfig,
} from "@/components/data-table/types/custom-pagination";
import { JavaSpringPageMetadata } from "@/lib/types/server-page-metadatas.types";

const DEFAULT_PAGE_SIZE = 10;

export type JavaPaginationMeta = {
  page: number;
  pageIndex: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type JavaPaginatedResponse<T> = {
  content?: T[];
  page?: JavaSpringPageMetadata;
};

export type JavaPaginatedResult<T> = {
  data: T[];
  meta: JavaPaginationMeta;
};

export const extractJavaPaginationMeta = (
  page?: JavaSpringPageMetadata,
): JavaPaginationMeta => {
  const pageIndex = page?.number ?? 0;

  return {
    page: pageIndex + 1,
    pageIndex,
    pageSize: page?.size ?? DEFAULT_PAGE_SIZE,
    total: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
};

export const mapJavaPaginatedResponse = <T>(
  response?: JavaPaginatedResponse<T>,
): JavaPaginatedResult<T> => {
  return {
    data: response?.content ?? [],
    meta: extractJavaPaginationMeta(response?.page),
  };
};

export const createJavaServerPaginationConfig = (
  meta: JavaPaginationMeta | undefined,
  onPaginationChange: ServerPaginationChangeEventCallback,
): ServerPaginationTanstackTableConfig | undefined => {
  if (!meta) return undefined;

  return {
    pageIndex: meta.pageIndex,
    pageSize: meta.pageSize,
    pageCount: meta.totalPages,
    total: meta.total,
    onPaginationChange,
  };
};
