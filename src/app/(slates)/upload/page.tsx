"use client";

import FileRowComponent from "@/components/FileRowComponent";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useContext } from "react";
import { SlateContext } from "@/contexts";

export default function UploadPhotoSection() {
  const { rows, addRow } = useContext(SlateContext);

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (!file) return

  //   try {
  //     const data = new FormData()
  //     data.set('file', file)

  //     const res = await fetch('../api/upload', {
  //       method: 'POST',
  //       body: data
  //     })
  //   } catch (e: any) {
  //     console.error(e)
  //   }
  // };

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" }}>
        <Box display="grid" rowGap={2.5} maxHeight={400} overflow="scroll">
          {rows.map((row, index) => (
            <FileRowComponent key={index} index={index} row={row} />
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
