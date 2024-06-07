"use client";

import { useLoggedUserStateStore } from "@/stores/loggedUserStore";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function SlatesRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useLoggedUserStateStore((state) => state.user);
  const router = useRouter();
  useLayoutEffect(() => {
    // NOTE: Since (authenticated) route already checked whether user is logged in or not
    //       here just need to check whether the user is admin and OTP is verified

    // console.log({ user })

    // NOTE: SANITY CHECK
    if (user === null) {
      console.log('routing to root! from admin layout')
      router.push("/");
      return;
    }

    if (user.role !== "admin") {
      alert("YOU HAVE NO ACCESS!");
      router.push("/upload");
      return;
    }

    if (user.isOTPVerified === false) {
      // console.log({ user })
      alert("PLEASE VERIFY YOUR OTP! NOTE: DEVELOPMENT PHASE, ANY NUMBER WILL WORK");
    //   router.push("/admin_2FA");
      return;
    }
  }, [user]);
  return <>{children}</>;
}
