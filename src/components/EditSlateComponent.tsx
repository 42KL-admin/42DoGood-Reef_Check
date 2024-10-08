'use client';

import { useSelectedTabStore } from '@/stores/resultTabStore';
import { useSelectedSlateStore } from '@/stores/slateStore';
import theme from '@/theme';
import { Add, Remove, ZoomIn } from '@mui/icons-material';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import TabPanel from './TabPanel';
import SubstrateAndInvertEditor from './SubstrateAndInvertEditor';

function EditControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Box
      display="grid"
      justifyContent="center"
      sx={{
        backgroundColor: 'transparent',
        width: '100%',
        height: 'fit-content',
        position: 'absolute',
        bottom: '24px',
      }}
      py={2.5}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space"
        columnGap={5}
        width="fit-content"
        sx={{
          backgroundColor: 'white',
          px: 2.5,
          py: 1,
          borderRadius: 10,
          boxShadow: 2,
        }}
      >
        <IconButton aria-label="zoom out" onClick={() => zoomOut()}>
          <Remove htmlColor="black" />
        </IconButton>
        <IconButton aria-label="reset" onClick={() => resetTransform()}>
          <ZoomIn htmlColor="black" />
        </IconButton>
        <IconButton aria-label="zoom in" onClick={() => zoomIn()}>
          <Add htmlColor="black" />
        </IconButton>
      </Box>
    </Box>
  );
}

function EditImagePreview() {
  const slate = useSelectedSlateStore((state) => state.slate);
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  const imageWidth = isMd ? '100%' : isLg ? '80%' : isXl ? '50%' : '70%';

  return (
    slate && (
      <Box
        maxWidth="100%"
        maxHeight="100%"
        display="grid"
        alignContent={'center'}
        justifyContent={'center'}
        overflow={'hidden'}
        sx={{ position: 'relative' }}
      >
        <TransformWrapper>
          <TransformComponent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                src={slate.base64}
                alt={slate.file?.name || 'image preview'}
                width={0}
                height={0}
                style={{
                  width: imageWidth,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </TransformComponent>
          <EditControls />
        </TransformWrapper>
      </Box>
    )
  );
}

function EditSlateLargerScreen() {
  const slate = useSelectedSlateStore((state) => state.slate);

  return slate ? (
    <Box display="flex" height={'90vh'}>
      <Box
        width={'50%'}
        display="grid"
        justifyItems="center"
        sx={{ position: 'relative', flexShrink: 0 }}
      >
        <EditImagePreview />
      </Box>
      <Box width={'50%'} sx={{ backgroundColor: 'teal', flex: 1 }}>
        <SubstrateAndInvertEditor slate={slate} />
      </Box>
    </Box>
  ) : (
    <></>
  );
}

function EditSlateSmallerScreen() {
  const slate = useSelectedSlateStore((state) => state.slate);
  const selectedTab = useSelectedTabStore((state) => state.tab);

  return slate ? (
    <Box width={'100%'} height={'100%'}>
      <TabPanel tag={'slatePicture'} value={selectedTab as string}>
        <Box
          display={'grid'}
          justifyItems={'center'}
          width={'100%'}
          height={'100%'}
        >
          <EditImagePreview />
        </Box>
      </TabPanel>

      <TabPanel tag={'excelSheet'} value={selectedTab as string}>
        <Box width={'100%'} height={'100%'} sx={{ backgroundColor: 'teal' }}>
          <SubstrateAndInvertEditor slate={slate} />
        </Box>
      </TabPanel>
    </Box>
  ) : (
    <></>
  );
}

export default function EditSlateComponent() {
  const isLargerScreen = useMediaQuery(theme.breakpoints.up('md'));

  return isLargerScreen ? (
    <EditSlateLargerScreen />
  ) : (
    <EditSlateSmallerScreen />
  );
}
