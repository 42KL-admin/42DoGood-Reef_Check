'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ResultListNavBar from '@/components/ResultListNavBar';
import { RoundedButton } from '@/components/RoundedButton';
import { useMediaQuery } from '@mui/material';
import { useSelectedSlateStore } from '@/stores/slateStore';
import theme from '@/theme';
import NavBar from '@/components/mobile/NavBar';
import { ExportDialog } from '@/components/ExportDialog';
import { useUiStore } from '@/stores/uiStore';

export default function ResultListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const slate = useSelectedSlateStore((state) => state.slate);
  const setSelectedSlate = useSelectedSlateStore(
    (state) => state.setSelectedSlate,
  );
  const isLargerScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const readyToExport = useUiStore((state) => state.readyToExport);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          display: 'block',
          top: 0,
          zIndex: 1,
          backgroundColor: { xs: 'white', md: 'primary.light' },
        }}
      >
        {isLargerScreen ? (
          <ResultListNavBar
            backToPath={!slate ? '/upload' : '/results'}
            backAction={!slate ? () => {} : () => setSelectedSlate(null)}
            title={slate ? slate.exportName : 'My reef slates'}
            ctaButton={
              !slate ? (
                <></>
              ) : (
                <RoundedButton
                  variant="contained"
                  onClick={handleClickOpen}
                  disabled={!readyToExport}
                >
                  Export
                </RoundedButton>
              )
            }
          />
        ) : slate === null ? (
          <NavBar />
        ) : (
          <ResultListNavBar
            backToPath={!slate ? '/upload' : '/results'}
            backAction={!slate ? () => {} : () => setSelectedSlate(null)}
            title={slate ? slate.file!.name : 'My reef slates'}
            ctaButton={
              !slate ? (
                <></>
              ) : (
                <RoundedButton
                  variant="contained"
                  onClick={handleClickOpen}
                  disabled={!readyToExport}
                >
                  Export
                </RoundedButton>
              )
            }
          />
        )}
      </Box>
      {children}
      <ExportDialog
        open={open}
        setOpen={setOpen}
        slate={slate}
        shouldExport={true}
      />
    </Box>
  );
}
