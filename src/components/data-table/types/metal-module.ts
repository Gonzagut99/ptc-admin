import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: estoy declarando un modulo
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string;
  }
}
