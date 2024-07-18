"use client";

import { LoggedUser } from "@/stores/types";
import { useLayoutEffect } from "react";
import { getUserFromCookie } from "../../../lib/cookies";
import { useLoggedUserStateStore } from "@/stores/loggedUserStore";
import { useRouter } from "next/navigation";

export default function AuthenticatedGroupRouteLayout({ children }: { children: React.ReactNode }) {
  const user = useLoggedUserStateStore(state => state.user);
  const setLoggedUserState = useLoggedUserStateStore(state => state.setLoggedUserState);
  const router = useRouter();

  useLayoutEffect(() => {
    const userCookie: LoggedUser = getUserFromCookie();

    // NOTE: Force redirection using role
    // NOTE: If user not logged in, force redirect to login page
	// TODO Remove the router.push?
    if (userCookie === null) {
    //   router.push("/");
      return;
    }

    if (userCookie && user === null) {
      setLoggedUserState(userCookie);
    //   if (userCookie.role === "admin") {
    //     router.push("/admin_dashboard")
    //   } else {
    //     router.push("/upload");
    //   }
    }
  }, [user]);

  return <>{children}</>
}
