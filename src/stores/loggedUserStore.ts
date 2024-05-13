import { create } from "zustand";
import { LoggedUser } from "./types";
import { removeRCUserCookie, setRCUserCookie } from "../../lib/cookies";

type LoggedUserState = {
	user: LoggedUser | null;
};

type LoggedUserStateActions = {
	setLoggedUserState: (user: LoggedUser | null) => void;
	updateLoggedUserOTPStatus: (user: LoggedUser, status: boolean) => void;
};

export const useLoggedUserStateStore = create<
	LoggedUserState & LoggedUserStateActions
>()((set) => ({
	user: null,
	setLoggedUserState: (user: LoggedUser | null) => {
		set({ user });
		// NOTE: Mock Cookies
		if (user) {
			setRCUserCookie(user);
		} else {
			removeRCUserCookie();
		}
	},
	// NOTE: DO NOT CALL THIS IF `user` is NULL
	updateLoggedUserOTPStatus: (user: LoggedUser, status: boolean) => {
		const newUserState = user;

		newUserState.isOTPVerified = status;
		setRCUserCookie(newUserState);
		set({ user: newUserState });
	}
}));
