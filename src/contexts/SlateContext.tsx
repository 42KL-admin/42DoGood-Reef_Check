"use client";

import { Row, SlateType } from "@/hooks/upload/types";
import useRowControls from "@/hooks/upload/useRowControls";
import React, { createContext } from "react";

interface SlateContextValue extends ReturnType<typeof useRowControls> {}

const defaultSlateContextValue: SlateContextValue = {
  rows: [],
  addRow: () => {},
  removeRow: (index: number) => {},
  setSlateFile:
    (index: number, type: SlateType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {},
  unsetSlateFile: (index: number, type: SlateType) => {},
};

export const SlateContext = createContext<SlateContextValue>(
  defaultSlateContextValue
);

interface SlateProviderProps {
  children: React.ReactNode;
}

export const SlateProvider: React.FC<SlateProviderProps> = ({ children }) => {
  const rowControls = useRowControls();

  return (
    <SlateContext.Provider value={rowControls}>
      {children}
    </SlateContext.Provider>
  );
};
