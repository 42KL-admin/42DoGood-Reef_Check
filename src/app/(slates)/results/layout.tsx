"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import ResultListNavBar from "@/components/ResultListNavBar";
import { RoundedButton } from "@/components/RoundedButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useSelectedSlateStore } from "@/stores/slateStore";

export default function ResultListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const slate = useSelectedSlateStore((state) => state.slate);
  const setSelectedSlate = useSelectedSlateStore(
    (state) => state.setSelectedSlate
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        sx={{
          position: { xs: "static", md: "sticky" },
          display: "block",
          top: 0,
          zIndex: 1,
          backgroundColor: "primary.light",
        }}
      >
        <ResultListNavBar
          backToPath={!slate ? "/upload" : "/results"}
          backAction={!slate ? () => {} : () => setSelectedSlate(null)}
          title={slate ? slate.file!.name : "My reef slates"}
          ctaButton={
            !slate ? (
              <></>
            ) : (
              <RoundedButton variant="contained" onClick={handleClickOpen}>
                Export
              </RoundedButton>
            )
          }
        />
      </Box>
      {children}

      {/** Compulsory rename before export */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Rename before export</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="filename"
            name="text"
            label="eg. Tomok 8 July substrate 8.8m 2024"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 1 }}
            helperText="Site name, date, slate type, depth, year"
          />
        </DialogContent>
        <DialogActions sx={{ px: 6 }}>
          <RoundedButton variant="outlined" onClick={handleClose}>
            Cancel
          </RoundedButton>
          <RoundedButton variant="contained" onClick={() => {}}>
            Confirm
          </RoundedButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
