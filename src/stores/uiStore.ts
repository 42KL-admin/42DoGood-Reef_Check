import { create } from 'zustand';

type UIState = {
  readyToExport: boolean;
  readyToConvert: boolean;
  isLoggingIn: boolean;
};

type UIStateActions = {
  setReadyToExport: (state: boolean) => void;
  setReadyToConvert: (state: boolean) => void;
  setIsLoggingIn: (state: boolean) => void;
};

export const useUiStore = create<UIState & UIStateActions>()((set) => ({
  readyToExport: false,
  readyToConvert: true,
  isLoggingIn: false,
  setReadyToExport: (state: boolean) => {
    set({ readyToExport: state });
  },
  setReadyToConvert: (state: boolean) => {
    set({ readyToConvert: state });
  },
  setIsLoggingIn: (state: boolean) => {
    set({ readyToConvert: state });
  },
}));
