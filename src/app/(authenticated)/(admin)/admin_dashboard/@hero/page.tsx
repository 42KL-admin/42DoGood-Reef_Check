'use client';

import { Container, Box, TextField } from '@mui/material';
import { useState } from 'react';
import { RoundedButton } from '@/components/RoundedButton';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/navigation';
import Dropdownpermission from '@/components/Dropdownpermission';
import { useEmailRowStore } from '@/stores/emailRowStore';
import { EmailRole } from '@/stores/types';
import { inviteUser } from '@/services/dashboardApi';
import useSnackbarStore from '@/stores/snackbarStore';

export default function UploadUserSection() {
  const [selectedPermission, setSelectedPermission] =
    useState<EmailRole>('can edit');
  const [email, setEmail] = useState('');
  const addRow = useEmailRowStore((state) => state.addRow);
  const addMessage = useSnackbarStore((state) => state.addMessage);

  const router = useRouter();

  const handleInviteClick = async () => {
    try {
      const _ = await inviteUser(email, selectedPermission);
      addRow(email, selectedPermission);
      setEmail('');
      addMessage(`Invited ${email}.`, 'success');
    } catch (error: any) {
      addMessage(error.message, 'error');
      router.push('/');
    }
  };

  const handlePermissionChange = (permission: EmailRole) => {
    setSelectedPermission(permission);
  };

  return (
    <Container maxWidth="xl">
      <Box
        display="grid"
        justifyItems="center"
        rowGap={16}
        px={6}
        pt={4}
        pb={15}
      >
        <Box justifySelf="end" sx={{ py: 1 }}>
          <DropdownMenu />
        </Box>
        <Box display="flex" columnGap={2.5}>
          <Box
            sx={{
              width: '90vw', // Set width to 100% of the viewport width
              gap: '12px',
              maxHeight: '56px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              component="form"
              label="Enter email here"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{
                flex: 1, // Make the TextField fill the remaining space
                '& .MuiInputBase-input': {
                  borderRadius: '12px',
                  backgroundColor: 'white', // Set background color for text input
                },
                '& fieldset': {
                  borderWidth: '1px',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': { borderColor: '#107888' },
                  '&.Mui-focused fieldset': { borderColor: '#107888' },
                },
              }}
            />
            <Dropdownpermission
              initialPermission={selectedPermission}
              onChange={handlePermissionChange}
              borderColor="#C3C3C3"
            ></Dropdownpermission>
            <RoundedButton
              variant="contained"
              disabled={email.trim() === ''}
              onClick={handleInviteClick}
            >
              Invite
            </RoundedButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
