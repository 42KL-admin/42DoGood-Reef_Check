"use client";

import FileRowComponent from "@/components/FileRowComponent";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { TransitionGroup } from "react-transition-group";
import { Collapse, Drawer } from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { useFileRowStore } from "@/stores/fileRowStore";
import { useEffect } from "react";

export default function UploadPhotoSection() {
  const rows = useFileRowStore((state) => state.rows);
  const addRow = useFileRowStore((state) => state.addRow);

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" }}>
        <Box
          display="grid"
          rowGap={2.5}
          maxHeight={{ md: 400 }}
          overflow="scroll"
          sx={{ mb: { xs: 50, md: 0 } }}
        >
          <TransitionGroup>
            {rows.map((row, index) => (
              <Collapse key={row.id}>
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
            display: { xs: "none", md: "flex" },
          }}
          onClick={addRow}
        >
          Add more files
        </Button>
        {/** Drawer here (mobile) */}
        <Drawer
          variant="permanent"
          anchor="bottom"
          sx={{
            display: { xs: "block", md: "none", flexShrink: 0 },
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            rowGap={2}
            pt={2}
            pb={8}
          >
            <RoundedButton
              variant="outlined"
              itemType="secondary"
              startIcon={<Add />}
              sx={{ width: "256px" }}
              onClick={addRow}
            >
              Add more set
            </RoundedButton>
            <RoundedButton variant="contained" sx={{ width: "256px" }}>
              Process
            </RoundedButton>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
}
