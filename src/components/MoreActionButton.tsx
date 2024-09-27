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
  const [shouldExport, setShouldExport] = React.useState<boolean>(true);
  const openContextMenu = Boolean(anchorEl);
  const handleOpenContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const [openExportDialog, setOpenExportDialog] =
    React.useState<boolean>(false);
  const handleExportDialog = (state: boolean, shouldExport: boolean = true) => {
    setOpenExportDialog(state);
    setShouldExport(shouldExport);
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
          <MenuItem onClick={() => handleExportDialog(true, false)}>
            Rename
          </MenuItem>
          <MenuItem onClick={() => handleExportDialog(true)}>Export</MenuItem>
          <MenuItem onClick={() => removeSlate(id)}>Delete</MenuItem>
        </StyledMenu>
      </div>
      {/* Both ExportDialog and RenameDialog should be the same thing, just pass a flag into the component to toggle export functionality */}
      <ExportDialog
        open={openExportDialog}
        setOpen={handleExportDialog}
        slate={slate}
        closeAnchor={handleCloseContextMenu}
        shouldExport={shouldExport}
      />
    </>
  );
}
