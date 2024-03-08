"use client";

import React from "react";
import MoreVert from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { StyledMenu } from "./DropdownMenu";
import { MenuItem } from "@mui/material";

export default function MoreActionButton() {
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
      <IconButton
        id="moreaction-icon-1"
        aria-controls={open ? "moreaction-menu-1" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ mr: 4 }}
        onClick={handleClick}
      >
        <MoreVert sx={{ color: "black" }} />
      </IconButton>
      {/** Warning: id need to dynamically create */}
      <StyledMenu
        id="moreaction-menu-1"
        MenuListProps={{
          "aria-labelledby": "moreaction-icon-1",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>Rename</MenuItem>
        <MenuItem>Export</MenuItem>
        <MenuItem>Delete</MenuItem>
      </StyledMenu>
    </div>
  );
}
