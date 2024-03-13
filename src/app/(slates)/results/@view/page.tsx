"use client";

import ResultComponent from "@/components/ResultComponent";
import { SlateContext } from "@/contexts";
import { Box, Container } from "@mui/material";
import React, { Fragment, useContext } from "react";

export default function ResultListSection() {
  const { rows } = useContext(SlateContext);

  return (
    <Container maxWidth="xl">
      <Box px={14} py={8} display="grid" rowGap={4}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            <ResultComponent slate={row.substrate} />
            <ResultComponent slate={row.fishInverts} />
          </Fragment>
        ))}
      </Box>
    </Container>
  );
}
