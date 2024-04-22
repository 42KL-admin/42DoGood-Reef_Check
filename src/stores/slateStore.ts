import { create } from "zustand";
import { SlateState } from "./types";

type SelectedSlate = {
  slate: SlateState | null;
};

type SelectedSlateActions = {
  setSelectedSlate: (slate: SlateState | null) => void;
};

export const useSelectedSlateStore = create<
  SelectedSlate & SelectedSlateActions
>()((set) => ({
  slate: null,
  setSelectedSlate: (slate: SlateState | null) => set({ slate }),
}));
