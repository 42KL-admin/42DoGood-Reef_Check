"use client";

import React from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Menu, { MenuProps } from "@mui/material/Menu";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@mui/material";

// TODO: Improve this component, not done yet.

const DropdownButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: "12px",
  padding: "10px 12px",
  borderColor: "#6C797D",
  color: "black",
  fontWeight: 500,
  textTransform: "lowercase",
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
    backgroundColor: "#E9EFF1",
    borderRadius: "4px",
    width: "200px",
  },
  "& .MuiMenuItem-root": {
    fontSize: "14px",
    fontWeight: 400,
    padding: "16px 12px",
  },
}));

export default function DropdownMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <DropdownButton
        id="dropdown-btn"
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        disableElevation
        startIcon={<ArrowDropDown />}
        size="small"
        onClick={handleClick}
      >
        user@email.com
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
        <MenuItem>History?</MenuItem>
        <MenuItem>Logout?</MenuItem>
        <MenuItem>Idk</MenuItem>
      </StyledMenu>
    </div>
  );
}

export { DropdownButton, StyledMenu };
