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
  useMediaQuery,
} from "@mui/material";
import { useSelectedSlateStore } from "@/stores/slateStore";
import theme from "@/theme";
import NavBar from "@/components/mobile/NavBar";

interface ExportDialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
}

function ExportDialog(props: ExportDialogProps) {
  const { open, setOpen } = props;
  const handleClose = () => {
    setOpen(false);
  };

  return (
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
  );
}

export default function ResultListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const slate = useSelectedSlateStore((state) => state.slate);
  const setSelectedSlate = useSelectedSlateStore(
    (state) => state.setSelectedSlate
  );
  const isLargerScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        sx={{
          position: { xs: "static", md: "sticky" },
          display: "block",
          top: 0,
          zIndex: 1,
          backgroundColor: { xs: "white", md: "primary.light" },
        }}
      >
        {isLargerScreen ? (
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
        ) : slate === null ? (
          <NavBar />
        ) : (
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
        )}
      </Box>
      {children}
      <ExportDialog open={open} setOpen={setOpen} />
    </Box>
  );
}
