"use client";

import { SelectedSlateContext, SelectedSlateProvider } from "@/contexts";
import Box from "@mui/material/Box";
import React, { useContext } from "react";

export default function ResultListLayout({
  children,
  nav,
  view,
}: {
  children: React.ReactNode;
  nav: React.ReactNode;
  view: React.ReactNode;
}) {
  const { slate } = useContext(SelectedSlateContext);

  return (
    <SelectedSlateProvider>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "primary.light",
          }}
        >
          {nav}
        </Box>
        <Box sx={{ overflow: "auto", flex: 1 }}>
          {view}
        </Box>
      </Box>
    </SelectedSlateProvider>
  );
}
