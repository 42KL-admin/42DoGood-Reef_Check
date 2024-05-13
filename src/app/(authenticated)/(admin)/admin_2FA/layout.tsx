"use client";

import { useLoggedUserStateStore } from "@/stores/loggedUserStore";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function AdminRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useLoggedUserStateStore(state => state.user);
  const router = useRouter();

  useLayoutEffect(() => {
    // NOTE: Since (authenticated) route already checked whether the user is logged in or not,
    //       here just need to check whether the user has verified its OTP

    // NOTE: SANITY CHECK
    if (user === null) {
      router.push("/");
      return;
    }

    if (user.role !== "admin") {
      alert("YOU DONT HAVE ACCESS!")
      router.push("/upload");
      return;
    }

    if (user.isOTPVerified === true) {
      alert("You already verified your OTP!");
      router.push("/admin_dashboard");
      return;
    }
  }, [user]);
  return (
    <>{children}</>
  );
}
