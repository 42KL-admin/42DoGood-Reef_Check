"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ResultComponent from "@/components/ResultComponent";
import ResultListNavBar from "@/components/ResultListNavBar";
import { Fragment } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { useRouter } from "next/navigation";
import EditSlateComponent from "@/components/EditSlateComponent";
import { useFileRowStore } from "@/stores/fileRowStore";
import { useSelectedSlateStore } from "@/stores/slateStore";

function ResultListEmptyState() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyItems="center"
      alignItems="center"
      margin={"auto 0"}
      rowGap={8}
    >
      <Box display="grid" gap={2} justifyItems="center">
        <Typography fontSize={28}>
          You don&apos;t have any slates at the moment
        </Typography>
        <Typography fontSize={24}>
          Convert your photo into excel sheets to find them here
        </Typography>
      </Box>
      <RoundedButton
        variant="contained"
        sx={{ width: "272px" }}
        onClick={() => router.push("/upload")}
      >
        Go
      </RoundedButton>
    </Box>
  );
}

export default function ResultList() {
  const [open, setOpen] = useState<boolean>(false);
  const rows = useFileRowStore((state) => state.rows);
  const filteredRows = rows; // fix this
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
    <Fragment>
      <Box
        sx={{
          position: "sticky",
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
      {!slate ? (
        <Box sx={{ overflow: "auto", flex: 1 }} display="grid">
          {filteredRows.length !== 0 ? (
            <Container maxWidth="xl" sx={{ height: "100%" }}>
              <Box px={14} py={8} display="grid" rowGap={4}>
                {filteredRows.map((row, index) => (
                  <Fragment key={index}>
                    <ResultComponent slate={row.substrate} />
                    <ResultComponent slate={row.fishInverts} />
                  </Fragment>
                ))}
              </Box>
            </Container>
          ) : (
            <ResultListEmptyState />
          )}
        </Box>
      ) : (
        <EditSlateComponent />
      )}

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
    </Fragment>
  );
}
