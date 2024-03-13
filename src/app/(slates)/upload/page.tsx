"use client";

import FileRowComponent from "@/components/FileRowComponent";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useContext } from "react";
import { SlateContext } from "@/contexts";
import { TransitionGroup } from "react-transition-group";
import { Collapse } from "@mui/material";

export default function UploadPhotoSection() {
  const { rows, addRow } = useContext(SlateContext);

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" }}>
        <Box display="grid" rowGap={2.5} maxHeight={400} overflow="scroll">
          <TransitionGroup>
            {rows.map((row, index) => (
              <Collapse key={index}>
                <FileRowComponent index={index} row={row} />
              </Collapse>
            ))}
          </TransitionGroup>
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
