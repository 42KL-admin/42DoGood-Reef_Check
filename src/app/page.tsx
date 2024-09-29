'use client';

import {
  Button,
  Typography,
  Container,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoggedUserStateStore } from '@/stores/loggedUserStore';
import { LoginResponse, login } from '@/services/loginApi';
import { sendOTP } from '@/services/otpApi';
import useSnackbarStore from '@/stores/snackbarStore';
import LogoImage from '@/../public/images/logo.png';
import { useUiStore } from '@/stores/uiStore';
import { UserRole } from '@/stores/types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const setLoggedUserState = useLoggedUserStateStore(
    (state) => state.setLoggedUserState,
  );
  const addMessage = useSnackbarStore((state) => state.addMessage);
  const queryParams = useSearchParams();
  const loginStatus = queryParams.get('status');

  const handleSendOTP = async (user: {
    _id: string;
    email: string;
    role: string;
  }) => {
    setIsLoggingIn(true);

    try {
      const _ = await sendOTP(user.email);
      addMessage(
        `OTP sent to ${user.email}! Please check your email!`,
        'success',
      );
      router.push('/admin_2FA');
    } catch (e: any) {
      addMessage(e, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    setIsLoggingIn(true);

    try {
      const response: LoginResponse = await login(email);
      const { user } = response;
      const { email: loggedEmail, role } = user;

      setLoggedUserState({
        email: loggedEmail,
        role,
        isOTPVerified: false,
      });
      if (role === 'admin') {
        addMessage(`Sending login OTP to ${loggedEmail}...`, 'info');
        handleSendOTP(user);
      } else {
        addMessage(`Welcome back. Logging as ${loggedEmail}`, 'success');
        router.push('/upload');
        setIsLoggingIn(false);
      }
    } catch (e: any) {
      addMessage(e.message, 'error');
    }
  };

  // for catching the unauthorized access
  useEffect(() => {
    if (loginStatus && parseInt(loginStatus) === 401) {
      addMessage('Unauthorized access. Please login first!', 'error');
      const url = new URL(window.location.href);
      url.searchParams.delete('status');
      window.history.replaceState({}, '', url.toString());
    }
  }, [loginStatus, addMessage]);

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
          <Image src={LogoImage} alt="Logo" width={197} height={171} priority />
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
                borderColor: 'primary.main',
                borderWidth: '1px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': { borderColor: '#107888' },
                '&.Mui-focused fieldset': { borderColor: '#107888' },
              },
            }}
          />
          <Typography
            variant="subtitle1"
            align="left"
            fontSize="8px"
            color="#006878"
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
          {isLoggingIn ? (
            <CircularProgress size={20} />
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: '100px',
                '&:hover': { backgroundColor: '#107888' },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
