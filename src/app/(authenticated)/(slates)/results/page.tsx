"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ResultComponent from "@/components/ResultComponent";
import { Fragment } from "react";
import { Typography } from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { useRouter } from "next/navigation";
import EditSlateComponent from "@/components/EditSlateComponent";
import { useFileRowStore } from "@/stores/fileRowStore";
import { useSelectedSlateStore } from "@/stores/slateStore";
import { SlateState } from "@/stores/types";

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
        <Typography
          sx={{
            fontSize: { xs: 18, md: 28 },
          }}
        >
          You don&apos;t have any slates at the moment
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 16, md: 24 },
          }}
        >
          Convert your photo into excel sheets to find them here
        </Typography>
      </Box>
      <RoundedButton
        variant="contained"
        sx={{ width: { sx: "200px", md: "272px" } }}
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
  const [filteredSlates, setFilteredSlates] = useState<SlateState[]>([]);

  useEffect(() => {
    const filtered = rows
      .flatMap((row) => [row.substrate, row.fishInverts])
      .filter((slate) => slate.file !== null);
    setFilteredSlates(filtered);
  }, [rows]);

  return (
    <Fragment>
      {!slate ? (
        <Box
          sx={{ overflow: "auto", flex: 1, mt: { xs: 22, md: 0 } }}
          display="grid"
        >
          {filteredSlates.length !== 0 ? (
            <Container maxWidth="xl" sx={{ height: "100%" }}>
              <Box
                py={8}
                display="grid"
                rowGap={4}
                sx={{ px: { xs: 2, md: 14 }, pt: { xs: 0, md: 8 }, pb: 8 }}
              >
                {filteredSlates.map((slate, index) => (
                  <Fragment key={index}>
                    <ResultComponent slate={slate} />
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
