"use client";

import { Button, Typography, Container, Box, TextField } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        const payload = await response.json();
        alert(payload.message);
        // TODO: Set cookie here
        if (response.status == 200) {
          if (payload.user["role"] == "admin")
            router.push("/admin_2FA");
          else
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
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              marginTop: "16px",
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
          <Typography
            variant="subtitle1"
            align="left"
            fontSize="8px"
            color="#006878"
            sx={{
              marginTop: "4px",
              marginBottom: "16px",
              marginLeft: "16px",
              "@media (min-width: 300px)": {
                fontSize: "12px",
              },
            }}
          >
            eg. example@gmail.com
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: "100px",
              "&:hover": { backgroundColor: "#107888" },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
