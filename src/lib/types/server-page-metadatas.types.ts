import { components } from "@/lib/api/types/api";
import { components as javaComponents } from "@/lib/api-java/api-java";

export type NestPaginationMetadata =
  components["schemas"]["PaginationMetadataDto"];
export type JavaSpringPageMetadata = javaComponents["schemas"]["PageMetadata"];
