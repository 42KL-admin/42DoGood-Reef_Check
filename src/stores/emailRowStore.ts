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

	// updatePermission: (email: string, permission: EmailRole) =>
	// 	set((state) => ({
	// 	rows: state.rows.map((row) => 
	// 	row.email === email ? { ...row, permission } : row)
    // })),

	updateRole: async (email: string, role: EmailRole) => {
		try {
		  const response = await fetch('/api/emails', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, role }),
		  });
	
		  if (response.ok) {
			const { data } = await response.json();
			set({
			  rows: get().rows.map((row) => (row.email === email ? data : row)),
			});
		  } else {
			console.error('Error updating role');
		  }
		} catch (error) {
		  console.error('Error updating role:', error);
		}
	  },

	clearRows: 	() => set({ rows: [] }),
  // ...
}));