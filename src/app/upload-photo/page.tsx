import InputFileUpload from "@/components/FileActionButton";
import FileRowComponent from "@/components/FileRowComponent";
import { Delete } from "@mui/icons-material";
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

type FileState = "upload" | "delete";

const statusIcon = (status: FileState) => {
  switch (status) {
    case "delete":
      return <Delete />;
    case "upload":
      return <Add />;
    default:
      return <></>;
  }
};

export default function UploadPhotoSection() {
  let status: FileState = "upload";

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters>
        <Box display="grid" rowGap={2.5}>
          <FileRowComponent />
          <FileRowComponent />
          <FileRowComponent />
          <FileRowComponent />
        </Box>
      </Container>
    </Box>
  );
}
