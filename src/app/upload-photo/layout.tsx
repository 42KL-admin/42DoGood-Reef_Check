import Box from "@mui/material/Box";

export default function UploadPhotoLayout({
  children,
  hero,
}: {
  children: React.ReactNode;
  hero: React.ReactNode;
}) {
  return (
    <Box>
      {hero}
      {children}
    </Box>
  );
}
