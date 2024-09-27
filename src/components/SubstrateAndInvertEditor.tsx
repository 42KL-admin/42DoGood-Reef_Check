import React, { useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import ExcelJS from 'exceljs';
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
  extractApiDataFromWorksheet,
  getExcelTemplateFiles,
  getSlateConfig,
  handleUpdateExcel,
  readBlobAsArrayBuffer,
} from '@/utils/exportExcelHelper';
import { SlateState } from '@/stores/types';

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
  const [blobData, setBlobData] = useState<Blob | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [cellStyles, setCellStyles] = useState<any>({});
  const addMessage = useSnackbarStore((state) => state.addMessage);

  const templateConfig: SlateConfig.SlateConfig = getSlateConfig(slate.type);

  // PARSE data to be used in the handsontable
  async function parseBlobData(blob: Blob) {
    try {
      const arrayBuffer = await readBlobAsArrayBuffer(blob);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const { extractedData, styles } = extractApiDataFromWorksheet(
        workbook,
        templateConfig,
      );

      // console.log('|BLob Data obtained| !! : ', extractedData);
      setExportFileData(extractedData);
      // console.log('|setExportFileData| !! : ', exportFileData);
      setCellStyles(styles);
    } catch (error) {
      console.error('Error processing Excel file:', error);
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
          setBlobData(updatedBlob);
          parseBlobData(updatedBlob);
        } else {
          setBlobData(null);
        }
      } catch (error: any) {
        addMessage(error.message, 'error');
      }
    };

    fetchExcelTemplateFiles();
  }, []);

  return (
    <div>
      {/* <input type="file" ref={fileInputRef} onChange={handleFileUpload} /> */}
      {exportFileData.length > 0 && (
        <div>
          <HotTable
            data={exportFileData}
            rowHeaders={true}
            width="100%"
            height="auto"
            licenseKey="non-commercial-and-evaluation"
          />
          <button
            onClick={() =>
              handleUpdateExcel(
                blobData,
                templateConfig,
                cellStyles,
                exportFileData,
              )
            }
          >
            Update Excel File
          </button>
        </div>
      )}
    </div>
  );
}
