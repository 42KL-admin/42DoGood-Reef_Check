"use client";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { ChangeEvent } from "react";
import { SlateState, SlateType } from "@/stores/types";
import { useFileRowStore } from "@/stores/fileRowStore";

const FileActionButton = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: "none",
  borderRadius: "8px",
  fontWeight: 400,
  color: "black",
  textTransform: "capitalize",
  textAlign: "left",
  [theme.breakpoints.up("xs")]: {
    width: 160,
    fontSize: "12px",
    padding: "8px 10px",
  },
  [theme.breakpoints.up("sm")]: {
    width: 200,
    fontSize: "0.875rem",
    padding: "4px 24px",
  },
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

interface InputFileUploadProps {
  rowId: string;
  slate: SlateState;
}

const getButtonText = (type: SlateType) => {
  return type === "substrate"
    ? "substrate slate"
    : type === "fishInverts"
    ? "fish & inverts slate"
    : "slate";
};

export default function InputFileUpload(props: InputFileUploadProps) {
  const { rowId, slate } = props;
  const setSlateFile = useFileRowStore((state) => state.setSlateFile);

  const handleFileChange =
    (rowId: string, type: SlateType) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];

      if (!selectedFile) return;

      setSlateFile(rowId, type, selectedFile);
    };

  return (
    <Box display="grid" rowGap={1.5} sx={{ width: "100%" }}>
      <Box
        display="flex"
        alignItems="center"
        columnGap={2.5}
        fontSize="14px"
        padding="18px 20px"
        borderRadius={3}
        sx={{ backgroundColor: "white" }}
      >
        {/** Desktop view */}
        {slate.file !== null ? (
          <FileActionButton
            variant="contained"
            color="warning"
            startIcon={<Delete />}
            onClick={() => setSlateFile(rowId, slate.type, null)}
          >
            remove
          </FileActionButton>
        ) : (
          <FileActionButton
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<Add />}
            color="secondary"
          >
            {getButtonText(slate.type)}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange(rowId, slate.type)}
            />
          </FileActionButton>
        )}
        <Typography
          fontSize="14px"
          sx={{
            flex: 1,
            width: {
              xs: "80px",
            },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {slate.file !== null ? slate.file.name : "Add files here..."}
        </Typography>
      </Box>
      <Typography fontSize="14px"></Typography>
    </Box>
  );
}
