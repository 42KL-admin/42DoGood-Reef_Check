'use client';

import React, { use } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { StyledMenu } from './DropdownMenu';
import { MenuItem } from '@mui/material';
import { useFileRowStore } from '@/stores/fileRowStore';
import { ExportDialog } from './ExportDialog';
import { RenameDialog } from './RenameDialog';
import { SlateState } from '@/stores/types';

export default function MoreActionButton({ slate }: { slate: SlateState }) {
  const { id } = slate;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openContextMenu = Boolean(anchorEl);
  const handleOpenContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const [openExportDialog, setOpenExportDialog] =
    React.useState<boolean>(false);
  const handleExportDialog = (state: boolean) => {
    setOpenExportDialog(state);
  };

  const [openRenameDialog, setOpenRenameDialog] =
    React.useState<boolean>(false);
  const handleRenameDialog = (state: boolean) => {
    setOpenRenameDialog(state);
  };

  const removeSlate = useFileRowStore((state) => state.removeSlate);

  return (
    <>
      <div>
        <IconButton
          id={`moreaction-icon-${id}`}
          aria-controls={openContextMenu ? `moreaction-menu-${id}` : undefined}
          aria-haspopup="true"
          aria-expanded={openContextMenu ? 'true' : undefined}
          sx={{ mr: 2 }}
          onClick={handleOpenContextMenu}
        >
          <MoreVert sx={{ color: 'black' }} />
        </IconButton>
        <StyledMenu
          id={`moreaction-menu-${id}`}
          MenuListProps={{
            'aria-labelledby': `moreaction-icon-${id}`,
          }}
          anchorEl={anchorEl}
          open={openContextMenu}
          onClose={handleCloseContextMenu}
        >
          <MenuItem onClick={() => handleRenameDialog(true)}>Rename</MenuItem>
          <MenuItem onClick={() => handleExportDialog(true)}>Export</MenuItem>
          <MenuItem onClick={() => removeSlate(id)}>Delete</MenuItem>
        </StyledMenu>
      </div>
      <ExportDialog open={openExportDialog} setOpen={handleExportDialog} />
      <RenameDialog
        open={openRenameDialog}
        setOpen={handleRenameDialog}
        slate={slate}
        closeAnchor={handleCloseContextMenu}
      />
    </>
  );
}
