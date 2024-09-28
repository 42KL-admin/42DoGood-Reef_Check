import { create } from 'zustand';

type UIState = {
  readyToExport: boolean;
  readyToConvert: boolean;
};

type UIStateActions = {
  setReadyToExport: (state: boolean) => void;
  setReadyToConvert: (state: boolean) => void;
};

export const useUiStore = create<UIState & UIStateActions>()((set) => ({

  readyToExport: false,
  readyToConvert: true,
  setReadyToExport: (state: boolean) => {
    set({ readyToExport: state });
  },
  setReadyToConvert: (state: boolean) => {
    set({ readyToConvert: state });
  },
}));
