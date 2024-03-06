"use client";

import FileRowComponent from "@/components/FileRowComponent";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import useRowControls from "@/hooks/upload/useRowControls";

export default function UploadPhotoSection() {
  const { rows, addRow, removeRow, setSlateFile, unsetSlateFile } =
    useRowControls();

  const handleRowRemoval = (index: number) => {
    console.log(index);
    removeRow(index);
  };

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" }}>
        <Box display="grid" rowGap={2.5} maxHeight={400} overflow="scroll">
          {rows.map((row, index) => (
            <FileRowComponent
              key={index}
              index={index}
              row={row}
              onRemove={() => handleRowRemoval(index)}
              setSlateFile={setSlateFile}
              unsetSlateFile={unsetSlateFile}
            />
          ))}
        </Box>
        <Button
          type="button"
          startIcon={<Add />}
          variant="text"
          size="large"
          sx={{
            textTransform: "unset",
            color: "black",
            fontWeight: 400,
            fontSize: 20,
            margin: "0 auto",
            mt: 9,
            width: "fit-content",
          }}
          onClick={addRow}
        >
          Add more files
        </Button>
      </Container>
    </Box>
  );
}
