'use client';

import { useState } from 'react';
import { Button, Container, Box, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoggedUserStateStore } from '@/stores/loggedUserStore';
import { sendOTP } from '@/services/sendOTPApi';

export default function Admin_2FA() {
  const [token, setToken] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimeoutId, setResendTimeoutId] = useState<NodeJS.Timeout | null>(
    null,
  );
  const user = useLoggedUserStateStore((state) => state.user);
  const router = useRouter();

  const resendOTP = async () => {
    if (!user?.email) {
      console.error('No email found');
      return;
    }

    setIsResendDisabled(true); // Disable the button
    if (resendTimeoutId) {
      clearTimeout(resendTimeoutId); // Clear any existing timeout
    }

    try {
      const _ = await sendOTP(user.email);

      // Set a timeout to re-enable the button after 5 seconds
      const timeoutId = window.setTimeout(() => {
        setIsResendDisabled(false);
      }, 5000);
      setResendTimeoutId(timeoutId as unknown as NodeJS.Timeout);
    } catch (error) {
      console.error('Error:', error);
      setIsResendDisabled(false); // Re-enable the button in case of an error
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      try {
        console.log('OTP checking');
        const response = await fetch('/api/admin/OTPVerification', {
          method: 'POST',
          body: JSON.stringify({ adminEmail: user?.email, otp: token }),
        });
        if (response.status === 200) {
          console.log('OTP correct');
          const sessionResponse = await fetch('/api/admin/SessionID', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminEmail: user?.email }),
          });

          if (sessionResponse.status === 200) {
            console.log('session made');

            // Redirect to admin dashboard if sessionID creation is successful
            router.replace('/admin_dashboard');
          } else {
            const error = await sessionResponse.json();
            console.error('Failed to create sessionID:', error.message);
          }
        } else {
          const error = await response.json();
          console.error('OTP verification failed:', error.message);
        }
      } catch (error) {
        console.error('Error:', error);
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
        <Box component="form" marginTop={2} width="70%" onSubmit={handleSubmit}>
          <TextField
            label="Enter 2FA Code"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
          <Box display="flex" justifyContent="flex-start">
            <Typography
              variant="body2"
              sx={{
                opacity: isResendDisabled ? 0.5 : 1,
                marginTop: '4px',
                marginBottom: '16px',
                color: 'primary.main',
              }}
            >
              Didn&apos;t receive code?{' '}
              <Typography
                component="span"
                sx={{
                  textDecoration: 'underline',
                  cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                  color: 'primary.main',
                }}
                onClick={!isResendDisabled ? resendOTP : undefined}
              >
                Send again
              </Typography>
            </Typography>
          </Box>
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
        </Box>
      </Box>
    </Container>
  );
}
