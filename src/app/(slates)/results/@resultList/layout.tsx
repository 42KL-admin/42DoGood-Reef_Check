import Box from "@mui/material/Box";
import React from "react";

export default function ResultListLayout({
  children,
  nav,
  resultList,
}: {
  children: React.ReactNode;
  nav: React.ReactNode;
  resultList: React.ReactNode;
}) {
  return (
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
      <Box sx={{ overflow: "auto", flex: 1 }}>{resultList}</Box>
    </Box>
  );
}
