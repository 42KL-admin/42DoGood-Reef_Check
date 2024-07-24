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
import { useRouter } from "next/navigation";
import useSnackbarStore from "@/stores/snackbarStore";
import { SlateType, SlateUploadItem, UploadFilesResponse } from "@/stores/types";
import { checkSasToken } from "@/services/sasTokenApi";
import { postOcrProcessUrl } from "@/utils/postOcrProcessUrl";
import { uploadSlatesToBlob } from "@/services/uploadSlateApi";

export default function UploadPhotoSection() {
  const addRow = useFileRowStore((state) => state.addRow);
  const setSlateExcelFile = useFileRowStore((state) => state.setSlateExcelFile);
  const fileRows = useFileRowStore((state) => state.rows);
  const setSlateStatus = useFileRowStore((state) => state.setSlateStatus);
  const addMessage = useSnackbarStore((state) => state.addMessage);

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

        const ocrImageList = uploadResponse.results;

        try {
          // looping through each available item
          ocrImageList.forEach(async (item: any) => {
            // a bit hardcody but it works, when SAS token is done then we can refactor this part
            const blobUrlWithoutSas = `https://reefcheckslates.blob.core.windows.net/slates/slates/${item.filename}`;

            const postOcrProcessUrlResponse =
              await postOcrProcessUrl(blobUrlWithoutSas);

            const idAndType = item.id.split(':');

            if (postOcrProcessUrlResponse) {
              setSlateExcelFile(
                idAndType[0],
                idAndType[1],
                postOcrProcessUrlResponse,
              );
              // When each of them are done, change status from processing to recognized
              // Logic is in InputFileUpload.tsx if further enhancement is needed
              setSlateStatus(idAndType[0], idAndType[1], 'recognized');
            }
          });
        } catch (e: any) {
          addMessage(e.message, 'error');
        }
      } catch (e: any) {
        addMessage(e.message, 'error');
        console.log('error uploading slates', e.message);
        throw new Error('uploadSlatesToBlob error', e.message);
      }
    }
  };


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
            {fileRows.map((row, index) => (
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
          Add more set
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
            <RoundedButton variant="contained" sx={{ width: "256px" }} onClick={uploadSlates}>
              Convert Files Now
            </RoundedButton>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
}
