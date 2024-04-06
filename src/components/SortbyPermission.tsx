"use client";

import React, { useState } from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Menu, { MenuProps } from "@mui/material/Menu";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
import { EmailPermission } from "@/stores/types";

const DropdownButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: "4px",
    padding: "8px 16px",
    borderColor: "white",
    // backgroundColor: "white",
    // borderColor : "#C3C3C3",
    color: "#494949",
    fontWeight: 500,
    textTransform: "none",
    height: "36px",
    width: "auto",
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
      width: "128px",
      // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add box shadow
    },
    "& .MuiMenuItem-root": {
      fontSize: "14px",
      fontWeight: 400,
      padding: "8px 16px", // Adjust padding
    },
  }));

interface SortByPermissionProps {
  onSortByPermission: (permission: EmailPermission | null) => void;
}

export default function SortByPermission({onSortByPermission}: SortByPermissionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPermission, setSelectedPermission] = useState<EmailPermission | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePermissionSelect = (permission: EmailPermission | null) => {
    setSelectedPermission(permission);
    onSortByPermission(permission);
    handleClose();
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
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
        Permissions
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
        <MenuItem onClick={() => handlePermissionSelect(null)}>All</MenuItem>
        <MenuItem onClick={() => handlePermissionSelect("admin")}>Admin</MenuItem>
        <MenuItem onClick={() => handlePermissionSelect("can edit")}>Can edit</MenuItem>
      </StyledMenu>
    </div>
  );
};
