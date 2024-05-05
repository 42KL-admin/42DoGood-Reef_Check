import { create } from "zustand";

export type ResultTab = "slatePicture" | "excelSheet";

type SelectedTab = {
  tab: ResultTab;
};

type SelectedTabActions = {
  setSelectedTab: (tab: ResultTab) => void;
};

export const useSelectedTabStore = create<SelectedTab & SelectedTabActions>()(
  (set) => ({
    tab: "slatePicture",
    setSelectedTab: (newTab: ResultTab) => {
      set({ tab: newTab });
    },
  })
);
