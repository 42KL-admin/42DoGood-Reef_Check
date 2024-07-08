'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MoreActionButton from './MoreActionButton';
import { Card, CardActionArea, CardActions } from '@mui/material';
import { SlateState } from '@/stores/types';
import { useSelectedSlateStore } from '@/stores/slateStore';

export default function ResultComponent({ slate }: { slate: SlateState }) {
  const setSelectedSlate = useSelectedSlateStore(
    (state) => state.setSelectedSlate,
  );

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
        <CardActionArea onClick={() => setSelectedSlate(slate)}>
          <Box py={6} px={2.5}>
            <Typography sx={{ flex: 1 }}>{slate.file.name}</Typography>
          </Box>
        </CardActionArea>
        <CardActions>
          <MoreActionButton id={'1'} /> {/* fix this */}
        </CardActions>
      </Box>
    </Card>
  );
}
