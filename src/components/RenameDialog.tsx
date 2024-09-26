import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { RoundedButton } from './RoundedButton';
import { DialogProps } from './ExportDialog';
import { SlateState } from '@/stores/types';
import React from 'react';
import { useFileRowStore } from '@/stores/fileRowStore';

interface ExtendedDialogProps extends DialogProps {
  slate: SlateState;
  closeAnchor: () => void;
}

export function RenameDialog(props: ExtendedDialogProps) {
  const { open, setOpen, slate, closeAnchor } = props;
  const [fileName, setFileName] = React.useState(
    slate.file ? slate.file.name : `${slate.type}_${new Date()}`,
  );
  const handleClose = () => {
    setOpen(false);
  };
  const renameSlate = useFileRowStore((state) => state.renameSlate);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Rename file</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="filename"
          name="text"
          label="eg. Tomok 8 July substrate 8.8m 2024"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 1 }}
          helperText="Site name, date, slate type, depth, year"
          value={fileName}
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 6 }}>
        <RoundedButton variant="outlined" onClick={handleClose}>
          Cancel
        </RoundedButton>
        <RoundedButton
          variant="contained"
          onClick={() => {
            renameSlate(slate.id, fileName);
            handleClose();
            closeAnchor();
          }}
        >
          Confirm
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}
