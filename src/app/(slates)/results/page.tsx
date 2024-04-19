"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ResultComponent from "@/components/ResultComponent";
import ResultListNavBar from "@/components/ResultListNavBar";
import { Fragment } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { useRouter } from "next/navigation";
import EditSlateComponent from "@/components/EditSlateComponent";
import { useFileRowStore } from "@/stores/fileRowStore";
import { useSelectedSlateStore } from "@/stores/slateStore";
import NavBar from "@/components/mobile/NavBar";

function ResultListEmptyState() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyItems="center"
      alignItems="center"
      margin={"auto 0"}
      rowGap={8}
    >
      <Box display="grid" gap={2} justifyItems="center">
        <Typography fontSize={28}>
          You don&apos;t have any slates at the moment
        </Typography>
        <Typography fontSize={24}>
          Convert your photo into excel sheets to find them here
        </Typography>
      </Box>
      <RoundedButton
        variant="contained"
        sx={{ width: "272px" }}
        onClick={() => router.push("/upload")}
      >
        Go
      </RoundedButton>
    </Box>
  );
}

export default function ResultList() {
  const rows = useFileRowStore((state) => state.rows);
  const slate = useSelectedSlateStore((state) => state.slate);
  const filteredRows = rows; // fix this

  return (
    <Fragment>
      <Box
      >
        {/* <NavBar /> */}
      </Box>
      {!slate ? (
        <Box sx={{ overflow: "auto", flex: 1 }} display="grid">
          {filteredRows.length !== 0 ? (
            <Container maxWidth="xl" sx={{ height: "100%" }}>
              <Box
                py={8}
                display="grid"
                rowGap={4}
                sx={{ px: { xs: 2, md: 14 }, pt: { xs: 0, md: 8 }, pb: 8 }}
              >
                {filteredRows.map((row, index) => (
                  <Fragment key={index}>
                    <ResultComponent slate={row.substrate} />
                    <ResultComponent slate={row.fishInverts} />
                  </Fragment>
                ))}
              </Box>
            </Container>
          ) : (
            <ResultListEmptyState />
          )}
        </Box>
      ) : (
        <EditSlateComponent />
      )}
    </Fragment>
  );
}
