"use client";

import React from "react";
import MoreVert from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { StyledMenu } from "./DropdownMenu";
import { MenuItem } from "@mui/material";

export default function MoreActionButton({ id }: { id: string }) {
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
        id={`moreaction-icon-${id}`}
        aria-controls={open ? `moreaction-menu-${id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ mr: 2 }}
        onClick={handleClick}
      >
        <MoreVert sx={{ color: "black" }} />
      </IconButton>
      <StyledMenu
        id={`moreaction-menu-${id}`}
        MenuListProps={{
          "aria-labelledby": `moreaction-icon-${id}`,
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
