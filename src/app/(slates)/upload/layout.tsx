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
      <Box sx={{ backgroundColor: { sx: "white", md: "primary.light" } }}>
        {hero}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}
