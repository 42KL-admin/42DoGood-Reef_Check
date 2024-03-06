import FileRowComponent from "@/components/FileRowComponent";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
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
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" }}>
        <Box display="grid" rowGap={2.5} maxHeight={400} overflow="scroll">
          <FileRowComponent />
          <FileRowComponent />
        </Box>
        <Button
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
          }}
        >
          Add more files
        </Button>
      </Container>
    </Box>
  );
}
