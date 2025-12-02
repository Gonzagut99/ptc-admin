import { create } from "zustand";

export type DialogType =
  | "create"
  | "edit"
  | "archive"
  | "delete"
  | "view"
  | "import"
  | "export"
  | "details"
  | "concrete"
  | "update"
  | "togleActive"
  | "file"
  | "register"
  | "signOut"
  | "archive"
  | "update-details"
  | "approve"
  | "cancel"
  | "receive"
  | "adjustment"
  | "movement-history"
  | "add-service"
  | "add-payment"
  | "add-incidency"
  | "update-status"
  | "update-payment-status"
  | null;

interface DialogStackItem<T = any> {
  module: string;
  type: DialogType;
  data: T | null;
}

interface DialogState<T = any> {
  // Estado
  isOpen: boolean;
  type: DialogType;
  data: T | null;
  module: string | null;

  // Stack para manejar dialogs anidados
  dialogStack: DialogStackItem<T>[];

  // Acciones básicas
  open: (module: string, type: DialogType, data?: T | null) => void;
  close: () => void;
  closeAll: () => void;
  clearData: () => void;
  isOpenForModule: (module: string, type?: DialogType) => boolean;

  // Acciones para stack de dialogs
  openChild: (module: string, type: DialogType, data?: T | null) => void;
  closeAndReturnToPrevious: () => void;
  clearStack: () => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  // Estado inicial
  isOpen: false,
  type: null,
  data: null,
  module: null,
  dialogStack: [],

  // Acciones básicas
  open: (module, type, data = null) =>
    set({
      isOpen: true,
      type,
      data,
      module,
      dialogStack: [], // Limpiar stack al abrir un dialog principal
    }),

  close: () => {
    const currentState = get();

    // Si hay dialogs en el stack, restaurar el anterior (es un hijo)
    if (currentState.dialogStack.length > 0) {
      const previousDialog =
        currentState.dialogStack[currentState.dialogStack.length - 1];
      const newStack = currentState.dialogStack.slice(0, -1);

      set({
        isOpen: true,
        type: previousDialog.type,
        data: previousDialog.data,
        module: previousDialog.module,
        dialogStack: newStack,
      });
    } else {
      // Si no hay stack, cerrar completamente (es un padre)
      set({
        isOpen: false,
        type: null,
        data: null,
        module: null,
        dialogStack: [],
      });
    }
  },

  closeAll: () =>
    set({
      isOpen: false,
      type: null,
      data: null,
      module: null,
      dialogStack: [],
    }),

  clearData: () =>
    set((state) => ({
      ...state,
      data: null,
    })),

  isOpenForModule: (module, type) => {
    const state = get();
    if (type) {
      return state.isOpen && state.module === module && state.type === type;
    }
    return state.isOpen && state.module === module;
  },

  // Acciones para stack de dialogs
  openChild: (module, type, data = null) => {
    const currentState = get();

    // Solo agregar al stack si hay un dialog abierto actualmente
    if (currentState.isOpen && currentState.module && currentState.type) {
      const currentDialog: DialogStackItem = {
        module: currentState.module,
        type: currentState.type,
        data: currentState.data,
      };

      set({
        isOpen: true,
        type,
        data,
        module,
        dialogStack: [...currentState.dialogStack, currentDialog],
      });
    } else {
      // Si no hay dialog abierto, comportarse como open normal
      set({
        isOpen: true,
        type,
        data,
        module,
        dialogStack: [],
      });
    }
  },

  closeAndReturnToPrevious: () => {
    const currentState = get();

    // Si hay dialogs en el stack, restaurar el anterior
    if (currentState.dialogStack.length > 0) {
      const previousDialog =
        currentState.dialogStack[currentState.dialogStack.length - 1];
      const newStack = currentState.dialogStack.slice(0, -1);

      set({
        isOpen: true,
        type: previousDialog.type,
        data: previousDialog.data,
        module: previousDialog.module,
        dialogStack: newStack,
      });
    } else {
      // Si no hay stack, cerrar completamente
      set({
        isOpen: false,
        type: null,
        data: null,
        module: null,
        dialogStack: [],
      });
    }
  },

  clearStack: () => {
    set((state) => ({
      ...state,
      dialogStack: [],
    }));
  },
}));

// Hook genérico tipado
export function useDialogStoreTyped<T = any>() {
  const store = useDialogStore();

  return {
    ...store,
    data: store.data as T,
    open: (module: string, type: DialogType, data?: T) =>
      store.open(module, type, data),
    openChild: (module: string, type: DialogType, data?: T) =>
      store.openChild(module, type, data),
  };
}
