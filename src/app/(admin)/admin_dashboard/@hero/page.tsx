"use client";

import { Button, Typography, Container, Box, TextField } from "@mui/material";
import { useState } from "react";
import { RoundedButton } from "@/components/RoundedButton";
import DropdownMenu from "@/components/DropdownMenu";
import { useRouter } from "next/navigation";
import Dropdownpermission from "@/components/Dropdownpermission";
import { useEmailRowStore } from "@/stores/emailRowStore";
import { EmailPermission } from "@/stores/types";

export default function UploadUserSection() {
  const [selectedPermission, setSelectedPermission] = useState<EmailPermission>("can edit");
  const [email, setEmail] = useState("");
  const addRow = useEmailRowStore((state) => state.addRow);

  const handleInviteClick = () => {
    if (email.trim() !== '') {
      addRow(email, selectedPermission);
      setEmail('');
    }
  };

  const handlePermissionChange = (permission: EmailPermission) => {
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
              width: "90vw", // Set width to 100% of the viewport width
              gap: "12px",
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
                  borderRadius: "12px",
                  backgroundColor: 'white', // Set background color for text input
                },
                "& fieldset": {
                  borderWidth: "1px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover fieldset": { borderColor: "#107888" },
                  "&.Mui-focused fieldset": { borderColor: "#107888" },
                },
              }}
            />
            <Dropdownpermission 
              initialPermission={selectedPermission} 
              onChange={handlePermissionChange}
              borderColor="#C3C3C3">
            </Dropdownpermission>
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
