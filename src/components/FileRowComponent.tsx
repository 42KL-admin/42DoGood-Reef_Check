import Box from "@mui/material/Box";
import InputFileUpload from "./InputFileUpload";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Row } from "@/hooks/upload/types";

interface FileRowComponentProps {
  row: Row;
  onRemove: () => void;
}

export default function FileRowComponent({
  row,
  onRemove,
}: FileRowComponentProps) {
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
        <InputFileUpload {...row.substrate} />
        <InputFileUpload {...row.fishInverts} />
      </Box>
      <IconButton aria-label="delete" onClick={onRemove}>
        <Delete />
      </IconButton>
    </Box>
  );
}
