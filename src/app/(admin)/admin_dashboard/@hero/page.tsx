"use client";

import { Button, Typography, Container, Box, TextField } from "@mui/material";
import { useState } from "react";

// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import CheckmarkChip from "@/components/CheckmarkChip";
import { RoundedButton } from "@/components/RoundedButton";
import DropdownMenu from "@/components/DropdownMenu";
// import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import Dropdownpermisson from "@/components/Dropdownpermission";

const ChipLabels = ["Not blurry", "Bright enough", "Pencil writing is clear"];

export default function UploadPhotoHeroSection() {
  const [email, setEmail] = useState("");
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
        <Box display="flex" columnGap={2.5}>
          <Box rowGap={2} display="grid">
            <TextField
                label="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{
                  "& fieldset": {
                    backgroundColor: "white",
                    borderColor: "primary.main",
                    borderWidth: "1px",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": { borderColor: "#107888" },
                    "&.Mui-focused fieldset": { borderColor: "#107888" },
                  },
                }}
            />
          </Box>
          <Box rowGap={2} display="grid">
            <Dropdownpermisson />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
