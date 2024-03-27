"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckmarkChip from "@/components/CheckmarkChip";
import { RoundedButton } from "@/components/RoundedButton";
import DropdownMenu from "@/components/DropdownMenu";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import Dropdownpermisson from "@/components/Dropdownpermission";

const ChipLabels = ["Not blurry", "Bright enough", "Pencil writing is clear"];

export default function UploadPhotoHeroSection() {
  const router = useRouter();
  return (
    <Container maxWidth="xl">
      <Box
        display="grid"
        justifyItems="center"
        rowGap={8}
        px={6}
        pt={4}
        pb={15}
      >
        <Box justifySelf="end" sx={{ py: 1 }}>
          <DropdownMenu />
        </Box>
        <Box rowGap={4} display="grid" justifyItems="center">
          <Box rowGap={2} display="grid">
            <Dropdownpermisson />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
