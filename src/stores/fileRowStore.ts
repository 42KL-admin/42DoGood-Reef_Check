import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

/**
 * Idea: add id for FileRow, remove id in SlateState.
 *
 * <id>_<slatetype>
 */

// Type of the slate
export type SlateType = "substrate" | "fishInverts";

// Recognition Status (OCR)
export type SlateRecognitionStatus =
  | "recognized"
  | "failed"
  | "unknown"
  | "processing";

// Each individual slate's state
export interface SlateState {
  type: SlateType;
  file: File | null;
  base64: string;
  status: SlateRecognitionStatus;
}

// Each individual row
export type FileRow = {
  id: string;
  substrate: SlateState;
  fishInverts: SlateState;
};

// All the rows (the main state)
export type FileRowSet = {
  rows: FileRow[];
};

// Actions that can be performed on the rows
export type FileRowActions = {
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
