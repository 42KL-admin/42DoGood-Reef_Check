"use client";

import React from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Menu, { MenuProps } from "@mui/material/Menu";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
import { useLoggedUserStateStore } from "@/stores/loggedUserStore";
import { useRouter } from "next/navigation";

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
  const user = useLoggedUserStateStore(state => state.user);
  const setLoggedUserState = useLoggedUserStateStore(state => state.setLoggedUserState);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = async () => {
	try {
		const response = await fetch('/api/admin/SessionID' , {
			method: 'DELETE',
			headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
		})

		const result = await response.json();

		if (result.status == 200) {
			setLoggedUserState(null);
			router.replace("/");
		}
	}
	catch (error) {
		console.error("Error logging out:", error);
	}
}

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
        {user && user.email}
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
        {user && user.role === "admin" && <MenuItem onClick={() => router.push("/upload")}>Upload Slates</MenuItem>}
        {user && user.role === "admin" && <MenuItem onClick={() => router.push("/admin_dashboard")}>Admin Dashboard</MenuItem>}
        <MenuItem onClick={() => logoutUser()}>Logout</MenuItem>
      </StyledMenu>
    </div>
  );
}

export { DropdownButton, StyledMenu };
