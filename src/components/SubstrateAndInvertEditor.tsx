import React, { useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from 'handsontable/cellTypes';
import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  MergeCells,
  registerPlugin,
} from 'handsontable/plugins';
import useSnackbarStore from '@/stores/snackbarStore';
import {
  getExcelTemplateFiles,
  getSlateConfig,
  parseBlobData,
} from '@/utils/exportExcelHelper';
import { SlateState } from '@/stores/types';
import { Box } from '@mui/material';
import { useUiStore } from '@/stores/uiStore';

registerCellType(CheckboxCellType);
registerCellType(NumericCellType);

registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);
registerPlugin(MergeCells);

interface ExportEditorProps {
  slate: SlateState;
}

export default function SubstrateAndInvertEditor(props: ExportEditorProps) {
  const { slate } = props;
  const [exportFileData, setExportFileData] = useState<(string | number)[][]>(
    [],
  );
  const addMessage = useSnackbarStore((state) => state.addMessage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setReadyToExport = useUiStore((state) => state.setReadyToExport);

  const templateConfig: SlateConfig.SlateConfig = getSlateConfig(slate.type);

  // PARSE data to be used in the handsontable
  async function handleParseBlobData(blob: Blob) {
    try {
      const { extractedData, styles } = await parseBlobData(
        blob,
        templateConfig,
      );

      // console.log('|BLob Data obtained| !! : ', extractedData);
      setExportFileData(extractedData);
      setIsLoading(false);
      setReadyToExport(true);
      // TODO: have a store to hide export button
      // console.log('|setExportFileData| !! : ', exportFileData);
    } catch (error) {
      addMessage('Error processing Excel file: ${error}', 'error');
    }
  }

  React.useEffect(() => {
    const fetchExcelTemplateFiles = async () => {
      try {
        const updatedBlob = await getExcelTemplateFiles(
          props.slate,
          templateConfig,
        );

        if (updatedBlob) {
          handleParseBlobData(updatedBlob);
        }
      } catch (error: any) {
        addMessage(error.message, 'error');
      }
    };

    fetchExcelTemplateFiles();
  }, []);

  return (
    <div>
      {!isLoading ? (
        exportFileData.length > 0 && (
          <div>
            <HotTable
              data={exportFileData}
              rowHeaders={true}
              width="100%"
              height="auto"
              licenseKey="non-commercial-and-evaluation"
            />
          </div>
        )
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" // Full screen height
          color="white"
        >
          <div>Loading...</div>
        </Box>
      )}
    </div>
  );
}
