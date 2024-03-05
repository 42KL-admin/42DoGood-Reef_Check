"use client";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";

const FileActionButton = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: "none",
  borderRadius: "8px",
  fontWeight: 400,
  color: "black",
  padding: "4px 24px",
  textTransform: "capitalize",
  width: 200,
  textAlign: "left",
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload() {
  return (
    <Box display="grid" rowGap={1.5} sx={{ width: "100%"}}>
      <Box
        display="flex"
        alignItems="center"
        columnGap={2.5}
        fontSize="14px"
        padding="18px 20px"
        borderRadius={3}
        sx={{ backgroundColor: "white" }}
      >
        <FileActionButton
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<Add />}
          color="secondary"
        >
          Fish & Inverts Slate
          <VisuallyHiddenInput type="file" />
        </FileActionButton>
        <Typography noWrap fontSize="14px">
          subslate1.jpg
        </Typography>
      </Box>
      <Typography fontSize="14px"></Typography>
    </Box>
  );
}
