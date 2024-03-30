import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { FileRow, SlateState, SlateType } from "./types";

// All the rows (the main state)
type FileRowSet = {
  rows: FileRow[];
};

// Actions that can be performed on the rows
type FileRowActions = {
  addRow: () => void;
  removeRow: (id: string) => void;
  setSlateFile: (id: string, type: SlateType, file: File | null) => void;
};

// helper functions
// Create slate
const createSlate = (type: SlateType): SlateState => {
  return {
    type,
    file: null,
    base64: "",
    status: "unknown",
  };
};

// Create a file row
const createFileRow = (): FileRow => {
  return {
    id: uuidv4(),
    substrate: createSlate("substrate"),
    fishInverts: createSlate("fishInverts"),
  };
};

export const useFileRowStore = create<FileRowSet & FileRowActions>()((set) => ({
  // start with one row
  rows: [createFileRow()],
  addRow: () =>
    set((state) => ({
      rows: [...state.rows, createFileRow()],
    })),

  removeRow: (id: string) =>
    set((state) => ({
      rows: state.rows.filter((row) => row.id !== id),
    })),

  // set a slate's file
  setSlateFile: (id: string, type: SlateType, file: File | null) =>
    set((state) => ({
      rows: state.rows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            [type]: {
              ...row[type],
              file: file,
            },
          };
        }
        return row;
      }),
    })),
}));