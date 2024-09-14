import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  FileRow,
  SlateRecognitionStatus,
  SlateState,
  SlateType,
} from './types';

// All the rows (the main state)
type FileRowSet = {
  rows: FileRow[];
};

// Actions that can be performed on the rows
type FileRowActions = {
  addRow: () => void;
  removeRow: (id: string) => void;
  removeSlate: (slateId: string) => void;
  setSlateFile: (id: string, type: SlateType, file: File | null) => void;
  setSlateExcelFile: (
    id: string,
    type: SlateType,
    excelFile: File | Blob | null,
  ) => void;
  setSlateStatus: (
    id: string,
    type: SlateType,
    status: SlateRecognitionStatus,
  ) => void;
};

// helper functions
// Create slate
const createSlate = (type: SlateType): SlateState => {
  return {
    id: uuidv4(),
    type,
    file: null,
    base64: '',
    status: 'not processed',
    excelFile: null,
  };
};

// Create a file row
const createFileRow = (): FileRow => {
  return {
    id: uuidv4(),
    substrate: createSlate('substrate'),
    fishInverts: createSlate('fishInverts'),
  };
};

const removeSlateFromRow = (row: FileRow, slateId: string): FileRow => {
  const result = {
    ...row,
    substrate: row.substrate.id === slateId ? createSlate('substrate') : row.substrate,
    fishInverts: row.fishInverts.id === slateId ? createSlate('fishInverts') : row.fishInverts,
  };
  console.log(result);
  return result;
}

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
  
  // remove a specific slate by its id
  removeSlate: (slateId: string) =>
    set((state) => ({
      rows: state.rows.map((row) => 
        row.substrate.id === slateId || row.fishInverts.id === slateId
          ? removeSlateFromRow(row, slateId)
          : row
      ),
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

  setSlateExcelFile: (
    id: string,
    type: SlateType,
    excelFile: File | Blob | null,
  ) =>
    set((state) => ({
      rows: state.rows.map((row) => {
        console.log('setting status');
        if (row.id === id) {
          const updatedRow = {
            ...row,
            [type]: {
              ...row[type],
              excelFile: excelFile,
            },
          };
          return updatedRow;
        }
        return row;
      }),
    })),

  // update slate conversion status
  setSlateStatus: (
    id: string,
    type: SlateType,
    status: SlateRecognitionStatus,
  ) =>
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
