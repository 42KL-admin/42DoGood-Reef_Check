'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MoreActionButton from './MoreActionButton';
import { Card, CardActionArea, CardActions } from '@mui/material';
import { SlateState } from '@/stores/types';
import { useSelectedSlateStore } from '@/stores/slateStore';
import { ConversionStatusIndicator } from './InputFileUpload';
import useSnackbarStore from '@/stores/snackbarStore';

export default function ResultComponent({ slate }: { slate: SlateState }) {
  const setSelectedSlate = useSelectedSlateStore(
    (state) => state.setSelectedSlate,
  );
  const addMessage = useSnackbarStore((state) => state.addMessage);

  const handleClick = () => {
    if (slate.status === 'recognized') {
      setSelectedSlate(slate);
    } else {
      addMessage('This file is still being processed :)', 'warning');
    }
  };

  return slate.file === null ? (
    <></>
  ) : (
    <Card sx={{ backgroundColor: 'primary.light', p: 2.5, boxShadow: 0 }}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        borderRadius={3}
        sx={{ backgroundColor: 'white' }}
      >
        <CardActionArea onClick={handleClick}>
          <Box py={6} px={2.5}>
            <Typography sx={{ flex: 1 }}>{slate.exportName}</Typography>
          </Box>
        </CardActionArea>
        <CardActions>
          {slate.status !== 'recognized' ? (
            <ConversionStatusIndicator status={slate.status} />
          ) : (
            <MoreActionButton slate={slate} />
          )}
        </CardActions>
      </Box>
    </Card>
  );
}
