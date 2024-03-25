"use client";

import React from "react";
import Box from "@mui/material/Box";
import { SelectedSlateProvider } from "@/contexts";

export default function ResultListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SelectedSlateProvider>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {children}
      </Box>
    </SelectedSlateProvider>
  );
}
