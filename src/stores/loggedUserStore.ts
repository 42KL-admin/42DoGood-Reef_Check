import { create } from "zustand";
import { LoggedUser } from "./types";

type LoggedUserState = {
	user: LoggedUser | null;
};

type LoggedUserStateActions = {
	setLoggedUserState: (user: LoggedUser | null) => void;
};

export const useLoggedUserStateStore = create<
	LoggedUserState & LoggedUserStateActions
>()((set) => ({
	user: null,
	setLoggedUserState: (user: LoggedUser | null) => {
	},
}));
