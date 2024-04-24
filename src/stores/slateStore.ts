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
  setSelectedSlate: (slate: SlateState | null) => {
    if (slate && slate.file) {
      // convert file object to a data URI
      const reader = new FileReader();
      reader.readAsDataURL(slate.file);
      reader.onload = () => {
        const fileURI = reader.result as string;
        console.log(fileURI);
        set({ slate: { ...slate, base64: fileURI } });
      };
    } else {
      // if no file is provided, set the slate directly
      set({ slate });
    }
  },
}));
