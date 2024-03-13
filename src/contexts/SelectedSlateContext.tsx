"use client";

import useSlate from "@/hooks/results/useSlate";
import { SlateState } from "@/hooks/upload/types";
import { createContext } from "react";

interface SelectedSlateContextValue extends ReturnType<typeof useSlate> {}

const defaultSlateStateValue: SlateState = {
  id: "",
  type: "substrate",
  file: null,
  status: "unknown",
};

const defaultSelectedSlateContextValue: SelectedSlateContextValue = {
  slate: defaultSlateStateValue,
  setSlate: () => {},
};

export const SelectedSlateContext = createContext<SelectedSlateContextValue>(
  defaultSelectedSlateContextValue
);

interface SelectedSlateProviderProps {
  children: React.ReactNode;
}

export const SelectedSlateProvider: React.FC<SelectedSlateProviderProps> = ({
  children,
}) => {
  const slate = useSlate();

  return (
    <SelectedSlateContext.Provider value={slate}>
      {children}
    </SelectedSlateContext.Provider>
  );
};
