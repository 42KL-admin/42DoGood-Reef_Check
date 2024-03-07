"use client"

import { useTheme, Button, Typography, Container, Box, TextField } from "@mui/material";
import { useState } from 'react';
import Image from "next/image";
import theme from "@/theme";

export default function Home() {
  const theme = useTheme();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Proceeding with email: ${email}`);
      setEmail('');
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
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={197}
            height={171}
          />
        </Box>
      <Box component="form" onSubmit={handleSubmit} marginTop={2} width="70%">
        <TextField
          label="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{
            marginTop: '16px',
            '& fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-root': {borderRadius: '12px',
            '&:hover fieldset': {borderColor: '#107888',},
            '&.Mui-focused fieldset': {borderColor: '#107888',},
            },
          }}
        />
        <Typography  
          variant="subtitle1"
          align="left"
          margin="2px 0"
          fontSize="8px"
          color="#006878"
          leftpadding="8px"
          sx={{
            marginTop: '4px',
            marginBottom: '16px',
            marginLeft: '16px',
            '@media (min-width: 300px)': {
              fontSize: '12px',
            },
          }}
        >
          eg. example@gmail.com
        </Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="normal"
          fullWidth
          sx={{
            borderRadius: '100px',
            '&:hover': {backgroundColor: '#107888',},
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  </Container>
);
}
