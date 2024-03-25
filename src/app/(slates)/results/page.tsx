"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ResultComponent from "@/components/ResultComponent";
import ResultListNavBar from "@/components/ResultListNavBar";
import { SelectedSlateContext, SlateContext } from "@/contexts";
import { Fragment, useContext } from "react";
import { Typography } from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { Row } from "@/hooks/upload/types";
import { useRouter } from "next/navigation";
import EditSlateComponent from "@/components/EditSlateComponent";

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
          You don't have any slates at the moment
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
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);
  const { rows } = useContext(SlateContext);
  const { slate, setSlate } = useContext(SelectedSlateContext);

  useEffect(() => {
    setFilteredRows(
      rows.filter((row) => row.fishInverts.id !== "" || row.substrate.id !== "")
    );
  }, [rows]);

  useEffect(() => {
    console.log(slate, rows);
  }, [slate]);

  return (
    <Fragment>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "primary.light",
        }}
      >
        <ResultListNavBar
          backToPath={!slate ? "/upload" : "/results"}
          backAction={!slate ? () => {} : () => setSlate(null)}
          title={slate ? slate.file!.name : "My reef slates"}
          ctaButton={
            !slate ? (
              <></>
            ) : (
              <RoundedButton variant="contained">Export</RoundedButton>
            )
          }
        />
      </Box>
      {!slate ? (
        <Box sx={{ overflow: "auto", flex: 1 }} display="grid">
          {filteredRows.length !== 0 ? (
            <Container maxWidth="xl" sx={{ height: "100%" }}>
              <Box px={14} py={8} display="grid" rowGap={4}>
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
