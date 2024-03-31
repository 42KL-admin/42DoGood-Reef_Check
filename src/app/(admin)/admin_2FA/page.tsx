"use client";

import { Button, Typography, Container, Box, TextField } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function admin_2FA() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {    // #TODO Was copied from login page, convert fetch for 2fa token
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({token}),
        });
        const payload = await response.json();
        alert(payload.message);
        if (response.status == 200) {
          router.push("/upload");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="90vh"
        textAlign="center"
        padding={0}
      >
        <Box marginBottom={0}>
          <Image src="/images/logo.png" alt="Logo" width={197} height={171} />
        </Box>
        <Box component="form" onSubmit={handleSubmit} marginTop={2} width="70%">
          <TextField
            label="Enter 2FA Code"
            type="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            fullWidth
            sx={{
              marginTop: "16px",
              marginBottom: "16px",
              "& fieldset": {
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: "100px",
              "&:hover": { backgroundColor: "#107888" },
            }}
            onClick={() => router.push("/admin_dashboard")}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
