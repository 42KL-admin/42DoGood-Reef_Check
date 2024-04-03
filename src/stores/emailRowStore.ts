import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { EmailPermission, EmailRow} from "./types";

// All the rows (the main state)
type EmailRowSet = {
  rows: EmailRow[];
};

// Actions that can be performed on the rows
type EmailRowActions = {
  addRow: (email: string, permission: EmailPermission) => void;
  removeRow: (email: string) => void;
  updatePermission: (email: string, permission: EmailPermission) => void;
};

// Create a file row
const createEmailRow = (): EmailRow => {
  return {
    email: "test@gmail.com",
    permission: "can edit",
  };
};

export const useEmailRowStore = create<EmailRowSet & EmailRowActions>()((set) => ({
  // One row as test
  rows: [createEmailRow()],
  addRow: (email: string, permission: EmailPermission) =>
    set((state) => ({
      rows: [...state.rows, { email, permission }],
    })),

  removeRow: (email: string) =>
    set((state) => ({
      rows: state.rows.filter((row) => row.email !== email),
    })),

  updatePermission: (email: string, permission: EmailPermission) =>
    set((state) => ({
      rows: state.rows.map((row) => 
        row.email === email ? { ...row, permission } : row
      )
    }))


//   // set a slate's file
//   setSlateFile: (email: string, type: SlateType, file: File | null) =>
//     set((state) => ({
//       rows: state.rows.map((row) => {
//         if (row.email === email) {
//           return {
//             ...row,
//             [type]: {
//               ...row[type],
//               file: file,
//             },
//           };
//         }
//         return row;
//       }),
//     })),
}));
