import { SlateProvider } from "@/contexts";
import Box from "@mui/material/Box";

export default function UploadPhotoLayout({
  children,
  hero,
}: {
  children: React.ReactNode;
  hero: React.ReactNode;
}) {
  return (
    <SlateProvider>
      <Box>
        <Box sx={{ backgroundColor: "primary.light" }}>{hero}</Box>
        <Box>{children}</Box>
      </Box>
    </SlateProvider>
  );
}
