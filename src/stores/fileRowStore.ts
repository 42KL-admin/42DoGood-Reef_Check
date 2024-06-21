import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { FileRow, SlateRecognitionStatus, SlateState, SlateType } from "./types";

// All the rows (the main state)
type FileRowSet = {
  rows: FileRow[];
};

// Actions that can be performed on the rows
type FileRowActions = {
  addRow: () => void;
  removeRow: (id: string) => void;
  setSlateFile: (id: string, type: SlateType, file: File | null) => void;
  setSlateStatus: (id: string, type: SlateType, status: SlateRecognitionStatus) => void;
};

// helper functions
// Create slate
const createSlate = (type: SlateType): SlateState => {
  return {
    type,
    file: null,
    base64: "",
    status: "not processed",
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
          const updatedRow = {
            ...row,
            [type]: {
              ...row[type],
              file: file,
            },
          };
          return updatedRow;
        }
        return row;
      }),
    })),

  // update slate conversion status
  setSlateStatus: (id: string, type: SlateType, status: SlateRecognitionStatus) =>
    set((state) => ({
      rows: state.rows.map((row) => {
        if (row.id === id) {
          const updatedRow = {
            ...row,
            [type]: {
              ...row[type],
              status: status,
            },
          };
          return updatedRow;
        }
        return row;
      }),
    })),
}));
