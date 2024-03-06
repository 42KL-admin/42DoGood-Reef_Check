"use client";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import { FileUploadState, SlateType } from "@/hooks/upload/types";
import Delete from "@mui/icons-material/Delete";

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

interface InputFileUploadProps {
  index: number;
  slate: FileUploadState;
  setSlateFile: (
    index: number,
    type: SlateType
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  unsetSlateFile: (index: number, type: SlateType) => void;
}

const getButtonText = (type: SlateType) => {
  return type === "substrate"
    ? "substrate slate"
    : type === "fishInverts"
    ? "fish & inverts slate"
    : "slate";
};

export default function InputFileUpload(props: InputFileUploadProps) {
  const { index, slate, setSlateFile, unsetSlateFile } = props;

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
        <FileActionButton
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={slate.file ? <Delete /> : <Add />}
          color={slate.file ? "warning" : "secondary"}
          onClick={() => {
            slate.file !== null && unsetSlateFile(index, slate.type);
          }}
        >
          {slate.file !== null ? "remove" : getButtonText(slate.type)}
          <VisuallyHiddenInput
            type="hidden"
            accept="image/*"
            onChange={setSlateFile(index, slate.type)}
          />
        </FileActionButton>
        <Typography noWrap fontSize="14px">
          {slate.file !== null ? slate.file.name : "Add files here..."}
        </Typography>
      </Box>
      <Typography fontSize="14px"></Typography>
    </Box>
  );
}
