import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { RoundedButton } from './RoundedButton';

export interface DialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
}

export function ExportDialog(props: DialogProps) {
  const { open, setOpen } = props;
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Rename before export</DialogTitle>
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
        />
      </DialogContent>
      <DialogActions sx={{ px: 6 }}>
        <RoundedButton variant="outlined" onClick={handleClose}>
          Cancel
        </RoundedButton>
        <RoundedButton variant="contained" onClick={() => {}}>
          Confirm
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}
