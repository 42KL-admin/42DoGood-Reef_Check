import Box from "@mui/material/Box";
import InputFileUpload from "./FileActionButton";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";

export default function FileRowComponent() {
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
        <InputFileUpload />
        <InputFileUpload />
      </Box>
      <IconButton aria-label="delete">
        <Delete />
      </IconButton>
    </Box>
  );
}
