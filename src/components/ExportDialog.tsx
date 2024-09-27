import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { RoundedButton } from './RoundedButton';
import { SlateState } from '@/stores/types';
import React from 'react';
import { useFileRowStore } from '@/stores/fileRowStore';
import { getSlateConfig, handleUpdateExcel } from '@/utils/exportExcelHelper';
import useSnackbarStore from '@/stores/snackbarStore';

export interface DialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  slate: SlateState | null;
  closeAnchor?: () => void;
  shouldExport?: boolean;
}

export function ExportDialog(props: DialogProps) {
  const { open, setOpen, slate, closeAnchor, shouldExport } = props;
  const [fileName, setFileName] = React.useState('');
  const renameSlate = useFileRowStore((state) => state.renameSlate);
  const handleClose = () => {
    setOpen(false);
  };
  const addMessage = useSnackbarStore((state) => state.addMessage);

  const exportAsExcel = () => {
    if (!slate) {
      addMessage('No slate was selected!', 'error');
      return;
    }

    const templateConfig: SlateConfig.SlateConfig = getSlateConfig(slate.type);

    handleUpdateExcel(slate.excelFile, templateConfig);
  };

  const handleConfirm = () => {
    if (slate) {
      renameSlate(slate.id, fileName);
    }

    if (shouldExport) {
      alert('export');
    }

    handleClose();
    closeAnchor && closeAnchor();
  };

  React.useEffect(() => {
    if (slate) {
      const fileName = slate.file
        ? slate.file.name
        : `${slate.type}_${new Date()}`;
      setFileName(fileName);
    }
  }, [slate]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        Rename {shouldExport ? 'before export' : 'file'}
      </DialogTitle>
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
        <RoundedButton variant="contained" onClick={handleConfirm}>
          Confirm
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}
