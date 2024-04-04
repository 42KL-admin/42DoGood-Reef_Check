"use client";

import React, { useState } from 'react';
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Menu, { MenuProps } from "@mui/material/Menu";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
import { EmailPermission } from '@/stores/types';

const DropdownButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: "12px",
  padding: "0 20px",
  borderColor: "#C3C3C3",
  backgroundColor: 'white',
  color: "#494949",
  fontWeight: 500,
  textTransform: "initial",
  height: '56px',
  width: "120px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "& .MuiButton-startIcon": {
    marginRight: "8px",
  },
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiMenu-list": {
    backgroundColor: "white",
    borderRadius: "4px",
    width: "120px",
  },
  "& .MuiMenuItem-root": {
    fontSize: "14px",
    fontWeight: 400,
    padding: "16px 12px",
  },
}));

interface DropdownPermissionProps {
  initialPermission: EmailPermission;
  onChange: (permission: EmailPermission) => void;
}

export default function DropdownPermission({initialPermission, onChange }: DropdownPermissionProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null); 
  };

  const handlePermissionSelect = (permission : EmailPermission) => {
    onChange(permission);
    handleClose();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DropdownButton
        id="dropdown-btn"
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        disableElevation
        endIcon={<ArrowDropDown />}
        size="small"
        onClick={handleClick}
      >
            {initialPermission}
      </DropdownButton>
      <StyledMenu
        id="dropdown-menu"
        MenuListProps={{
          "aria-labelledby": "dropdown-btn",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handlePermissionSelect("can edit")}>Can edit</MenuItem>
        <MenuItem onClick={() => handlePermissionSelect("admin")}>Admin</MenuItem>
      </StyledMenu>
    </div>
  );
}
