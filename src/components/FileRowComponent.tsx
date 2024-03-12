import Box from "@mui/material/Box";
import InputFileUpload from "./InputFileUpload";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Row } from "@/hooks/upload/types";
import { useContext } from "react";
import { SlateContext } from "@/contexts";

interface FileRowComponentProps {
  index: number;
  row: Row;
}

export default function FileRowComponent(props: FileRowComponentProps) {
  const { index, row } = props;
  const { removeRow } = useContext(SlateContext);

  return (
    <Box
      display="flex"
      sx={{ backgroundColor: "primary.light", padding: "10px 40px" }}
      alignItems="center"
      columnGap={2.5}
    >
      <Box
        display="flex"
        sx={{ flex: 1 }}
        columnGap={2.5}
        justifyContent="space-between"
      >
        <InputFileUpload index={index} slate={row.substrate} />
        <InputFileUpload index={index} slate={row.fishInverts} />
      </Box>
      <IconButton aria-label="delete" onClick={() => removeRow(index)}>
        <Delete />
      </IconButton>
    </Box>
  );
}
