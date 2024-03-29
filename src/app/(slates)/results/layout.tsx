"use client";

import React from "react";
import Box from "@mui/material/Box";

export default function ResultListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {children}
    </Box>
  );
}
