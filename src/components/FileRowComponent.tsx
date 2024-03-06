import Box from "@mui/material/Box";
import InputFileUpload from "./InputFileUpload";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Row, SlateType } from "@/hooks/upload/types";

interface FileRowComponentProps {
  index: number;
  row: Row;
  onRemove: () => void;
  setSlateFile: (
    index: number,
    type: SlateType
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  unsetSlateFile: (index: number, type: SlateType) => void;
}

export default function FileRowComponent(props: FileRowComponentProps) {
  const { index, row, onRemove, setSlateFile, unsetSlateFile } = props;

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
        <InputFileUpload
          index={index}
          slate={row.substrate}
          setSlateFile={setSlateFile}
          unsetSlateFile={unsetSlateFile}
        />
        <InputFileUpload
          index={index}
          slate={row.fishInverts}
          setSlateFile={setSlateFile}
          unsetSlateFile={unsetSlateFile}
        />
      </Box>
      <IconButton aria-label="delete" onClick={onRemove}>
        <Delete />
      </IconButton>
    </Box>
  );
}
