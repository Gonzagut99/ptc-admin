import { create } from "zustand";

export type BreadcrumbOverride = {
  // Pattern de la ruta (ej: '/operations/projects/[id]/requirements')
  pattern: string;
  // Label para reemplazar
  label: string;
  // Tipo de override
  type: "replace-segment" | "replace-all" | "replace-from-segment";
  // Índice del segmento a reemplazar (para replace-segment)
  segmentIndex?: number;
  // Desde qué segmento reemplazar (para replace-from-segment)
  fromSegmentIndex?: number;
  // Si es true, quita el url del segmento (lo hace no clickeable)
  removeUrl?: boolean;
};

type BreadcrumbState = {
  overrides: BreadcrumbOverride[];
  setOverride: (override: BreadcrumbOverride) => void;
  clearOverride: (pattern: string) => void;
  clearAllOverrides: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  overrides: [],
  setOverride: (override) =>
    set((state) => ({
      overrides: [
        ...state.overrides.filter((o) => o.pattern !== override.pattern),
        override,
      ],
    })),
  clearOverride: (pattern) =>
    set((state) => ({
      overrides: state.overrides.filter((o) => o.pattern !== pattern),
    })),
  clearAllOverrides: () => set({ overrides: [] }),
}));
