'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckmarkChip from '@/components/CheckmarkChip';
import { RoundedButton } from '@/components/RoundedButton';
import DropdownMenu from '@/components/DropdownMenu';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import NavBar from '@/components/mobile/NavBar';
import { checkSasToken } from '@/services/sasTokenApi';
import { useFileRowStore } from '@/stores/fileRowStore';
import { uploadSlatesToBlob } from '@/services/uploadSlateApi';
import {
  SlateType,
  SlateUploadItem,
  UploadFilesResponse,
} from '@/stores/types';

const ChipLabels = ['Not blurry', 'Bright enough', 'Pencil writing is clear'];

/**
 * 1. Remove those row with no values (substrate & fistInverts === null)
 * 2. Rows with values (either one), convert them. Set status to processing.
 * 3. Those that can be converted successfully, set status to success else failed.
 *
 * convert again:
 * 1. those that are success, move to "view results", make it hidden from list? (both success)
 * 2. those that has one slate success, stay in the list
 */

export default function UploadPhotoHeroSection() {
  const router = useRouter();
  const fileRows = useFileRowStore((state) => state.rows);
  const setSlateStatus = useFileRowStore((state) => state.setSlateStatus);

  const updateSlateStatus = (response: UploadFilesResponse[]) => {
    response.forEach((item) => {
      const [id, type] = item.id.split(':');
      setSlateStatus(
        id,
        type as SlateType,
        item.status === 'success' ? 'processing' : 'failed',
      );
    });
  };

  const uploadSlates = async () => {
    if (!fileRows) return;

    const slatesToBeUploaded: SlateUploadItem[] = fileRows
      .flatMap((row) => [
        row.substrate.file && row.substrate.status === 'not processed'
          ? { id: `${row.id}:${row.substrate.type}`, file: row.substrate.file }
          : null,
        row.fishInverts.file && row.fishInverts.status === 'not processed'
          ? {
              id: `${row.id}:${row.fishInverts.type}`,
              file: row.fishInverts.file,
            }
          : null,
      ])
      .filter((item): item is SlateUploadItem => item !== null);

    if (slatesToBeUploaded.length > 0) {
      try {
        await checkSasToken();
        const uploadResponse = await uploadSlatesToBlob(slatesToBeUploaded);
        updateSlateStatus(uploadResponse.results);
		console.log('uploadResponse: ', uploadResponse)
		// const something = await postOcrProcessUrl()
		// console.log('something: ', something)
      } catch (e: any) {
        console.log('error uploading slates', e.message);
        throw new Error('uploadSlatesToBlob error', e.message);
      }
    }
  };

  return (
    <Fragment>
      <NavBar />
      <Container maxWidth="xl">
        <Box
          display="grid"
          justifyItems="center"
          rowGap={8}
          px={6}
          pt={4}
          pb={{ xs: 0, md: 15 }}
          mt={{ xs: 20, md: 0 }}
        >
          <Box
            justifySelf="end"
            sx={{ py: 1, display: { xs: 'none', md: 'block' } }}
          >
            <DropdownMenu />
          </Box>
          <Box rowGap={4} display="grid" justifyItems="center">
            <Box rowGap={2} display="grid">
              <Typography
                variant="h5"
                align="center"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                Upload your slates photo
              </Typography>
              <Typography
                variant="h4"
                align="center"
                sx={{ fontSize: { xs: '14px', sm: '24px', md: '32px' } }}
              >
                Make sure that your photos are:
              </Typography>
            </Box>
            <Box
              display="flex"
              columnGap={2}
              flexWrap={'wrap'}
              justifyContent={'center'}
              sx={{ rowGap: { xs: 2, md: 0 } }}
            >
              {ChipLabels.map((chipLabel) => (
                <CheckmarkChip label={chipLabel} key={chipLabel} />
              ))}
            </Box>
          </Box>
          <Box
            display="flex"
            columnGap={2.5}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <RoundedButton
              variant="contained"
              size="large"
              onClick={uploadSlates}
            >
              convert files now
            </RoundedButton>
            <RoundedButton
              itemType="secondary"
              variant="outlined"
              size="large"
              onClick={() => router.push('/results')}
            >
              view results
            </RoundedButton>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
