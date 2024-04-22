"use client";

import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import Chip, { ChipProps } from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

const StyledChip = styled(Chip)<ChipProps>(({ theme }) => ({
  borderRadius: "8px",
  borderColor: "black",
  color: "black",
  userSelect: "none",
}));

export default function CheckmarkChip({ label }: { label: string }) {
  return (
    <StyledChip
      label={label}
      icon={<CheckCircleRounded color="primary" />}
      variant="outlined"
      sx={{ fontSize: { xs: "16px" } }}
    />
  );
}
