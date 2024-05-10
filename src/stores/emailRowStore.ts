import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { EmailRole, EmailRow} from "./types";

// All the rows (the main state)
type EmailRowSet = {
  rows: EmailRow[];
};

// Actions that can be performed on the rows
type EmailRowActions = {
  addRow: (email: string, role: EmailRole) => void;
  removeRow: (email: string) => void;
  updateRole: (email: string, role: EmailRole) => void;
  clearRows: () => void;
};

// To store and fetch permission from the admin_dashboard @hero
interface PermissionStore {
  selectedPermission: EmailRole;
  setSelectedPermission: (role: EmailRole) => void;
}


export const usePermissionStore = create<PermissionStore>((set) => ({
  selectedPermission: 'can edit'as EmailRole,
  setSelectedPermission: (role : EmailRole) => set({ selectedPermission: role }),
}));
  
export const useEmailRowStore = create<EmailRowSet & EmailRowActions>()((set, get) => ({
  // One row as test
  rows: [],

	addRow: (email: string, role: EmailRole) =>
		set((state) => ({
		rows: [...state.rows, { email, role }],
    })),

	removeRow: (email: string) =>
		set((state) => ({
		rows: state.rows.filter((row) => row.email !== email),
    })),

	updateRole: (email: string, role: EmailRole) =>
		set((state) => ({
		rows: state.rows.map((row) => 
		row.email === email ? { ...row, role } : row)
    })),

	clearRows: 	() => set({ rows: [] }),
  // ...
}));