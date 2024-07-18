import React, { useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import ExcelJS, { Workbook } from 'exceljs';
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
import { fetchTemplateFromBlobStorage } from '@/utils/azureBlobStorageHelper';
import { getExcelTemplateSasTokenCookie } from '@/services/excelTemplateSasTokenApi';
import useSnackbarStore from '@/stores/snackbarStore';

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
  type: 'substrate' | 'fishInverts';
  excelBlobData?: Blob | File | null;
}

// Stuff to set, probably the settings are wrong too cause I suck
const OcrResultsConfig: Record<string, SlateConfig.SlateConfig> = Object.freeze(
  {
    substrate: {
      rowNumberFrom: 10,
      rowNumberTo: 31,
      numberOfColumns: 16,
      ignoredRows: [],
      ignoredCols: [],
    },
    fishInverts: {
      rowNumberFrom: 9,
      rowNumberTo: 64,
      numberOfColumns: 5,
      ignoredRows: [24, 25, 26, 45, 48],
      ignoredCols: [1],
    },
  },
);

// Stuff to set, probably the settings are wrong too cause I suck
const SlateTypeConfig: Record<string, SlateConfig.SlateConfig> = Object.freeze({
  substrate: {
    rowNumberFrom: 13,
    rowNumberTo: 34,
    numberOfColumns: 16,
    ignoredRows: [],
    ignoredCols: [],
  },
  fishInverts: {
    rowNumberFrom: 9,
    rowNumberTo: 64,
    numberOfColumns: 5,
    ignoredRows: [24, 25, 26, 45, 48],
    ignoredCols: [1],
  },
});

// Read from template or ocrUpload config
function getSlateConfig(
  type: 'substrate' | 'fishInverts',
  isOcrResultsConfig?: boolean,
) {
  return isOcrResultsConfig ? OcrResultsConfig[type] : SlateTypeConfig[type];
}

function extractApiDataFromWorksheet(
  workbook: Workbook,
  config: SlateConfig.SlateConfig,
): { extractedData: (string | number)[][]; styles: any } {
  const worksheet = workbook.worksheets[0]; // Assuming the first sheet
  const jsonData: (string | number)[][] = [];
  const styles: any = {};

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber >= config.rowNumberFrom && rowNumber <= config.rowNumberTo) {
      if (config.ignoredRows.includes(rowNumber)) {
        jsonData.push(Array(config.numberOfColumns).fill(null)); // Placeholder for ignored rows
      } else {
        const rowValues = row.values as (string | number)[];
        rowValues.shift(); // Remove the first element which is usually the row number itself

        // Capture styles (LOGIC HERE PROBABLY WRONG, THE DISPLAY IN THE EXCEL REALLY NEED A FIX)
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (!styles[rowNumber - 1]) styles[rowNumber - 1] = {};
          styles[rowNumber - 1][colNumber - 1] = cell.style;
        });

        jsonData.push(rowValues.slice(0, config.numberOfColumns));
      }
    }
  });

  return { extractedData: jsonData, styles };
}
// pass worksheet you want to update, data to update, templateConfig, and cellStyles
function updateWorksheet(
  worksheet: ExcelJS.Worksheet,
  data: (string | number)[][],
  templateConfig: SlateConfig.SlateConfig,
  // apiConfig: SlateConfig.SlateConfig,
  cellStyles: any[],
) {
  data.forEach((row, rowIndex) => {
    const actualRowIndex = rowIndex + templateConfig.rowNumberFrom;

    if (templateConfig.ignoredRows.includes(actualRowIndex)) return; // Skip the ignored row

    row.forEach((cell, colIndex) => {
      if (templateConfig.ignoredCols.includes(colIndex + 1)) return; // Skip the ignored column

      const cellRef = worksheet.getCell(actualRowIndex, colIndex + 1);
      cellRef.value = cell;

      if (cellStyles[rowIndex] && cellStyles[rowIndex][colIndex]) {
        cellRef.style = cellStyles[rowIndex][colIndex];
      }
    });
  });
}

export default function SubstrateAndInvertEditor(props: ExportEditorProps) {
  const [exportFileData, setExportFileData] = useState<(string | number)[][]>(
    [],
  );
  const [blobData, setBlobData] = useState<Blob | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [cellStyles, setCellStyles] = useState<any>({});
  const addMessage = useSnackbarStore((state) => state.addMessage);

  const templateConfig: SlateConfig.SlateConfig = getSlateConfig(props.type);
  // const config: SlateConfig.SlateConfig = getSlateConfig(props.type);

  // I might be doing more than just "getExcelTemplatefiles"
  const getExcelTemplateFiles = async () => {
    try {
      const sasToken = await getExcelTemplateSasTokenCookie();

      console.log('SasToken generated successfully: ', sasToken);

      const blobFromStorage = await fetchTemplateFromBlobStorage(
        sasToken.value,
        props.type,
      );

      if (props.excelBlobData) {
        console.log('Excel Blob Data: ', props.excelBlobData);

        const apiArrayBuffer = await readBlobAsArrayBuffer(props.excelBlobData);
        const apiWorkbook = new ExcelJS.Workbook();
        await apiWorkbook.xlsx.load(apiArrayBuffer);

        const apiConfig = getSlateConfig(props.type, true);
        const { extractedData: apiData, styles: apiStyles } =
          extractApiDataFromWorksheet(apiWorkbook, apiConfig);

        const templateArrayBuffer =
          await readBlobAsArrayBuffer(blobFromStorage);
        const templateWorkbook = new ExcelJS.Workbook();
        await templateWorkbook.xlsx.load(templateArrayBuffer);

        const templateWorksheet = templateWorkbook.worksheets[0];
        updateWorksheet(
          templateWorksheet,
          apiData,
          templateConfig,
          //   apiConfig,
          apiStyles,
        );

        const buffer = await templateWorkbook.xlsx.writeBuffer();
        const updatedBlob = new Blob([buffer], {
          type: 'application/octet-stream',
        });
        setBlobData(updatedBlob);

        parseBlobData(updatedBlob);
      }
    } catch (error: any) {
      addMessage(error.message, 'error');
    }
  };

  async function updateExportFileData(
    blobData: Blob | File | null,
  ): Promise<Blob | void> {
    if (!blobData)
      return console.log('updateExportFileData: currently no file selected.');

    const arrayBuffer = await readBlobAsArrayBuffer(blobData);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];

    const updatedExcelConfig = templateConfig;
    const updatedCellStyles = cellStyles;

    // Update the worksheet with data and preserve styles
    updateWorksheet(
      worksheet,
      exportFileData,
      updatedExcelConfig,
      updatedCellStyles,
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const updatedBlob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    return updatedBlob;
  }

  // Helper function to convert readable stream to buffer
  async function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) resolve(reader.result);
        else reject(new Error('Failed to read blob as ArrayBuffer'));
      };

      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  // I MIGHT NOT NEED IT ANYMORE
  async function parseOcrData(blob: Blob) {
    try {
      // getting Excel Data
      const arrayBuffer = await readBlobAsArrayBuffer(blob);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const { extractedData, styles } = extractApiDataFromWorksheet(
        workbook,
        templateConfig,
      );
      console.log('|OCR Data obtained| !! : ', extractedData);
      // setOcrData(extractedData);
      // console.log('|setOcrData| !! : ', ocrData);
    } catch (error) {
      console.error('Error processing Excel file:', error);
    }
  }

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

  // File Upload function that was previously used. Leaving it here because it was hard work ;_;
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0]; // Assuming the first sheet
      const jsonData: (string | number)[][] = [];
      const styles: any = {};

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        // Extract rows 13 to 34
        if (rowNumber >= 13 && rowNumber <= 34) {
          const rowValues = row.values as (string | number)[];
          rowValues.shift(); // Remove the first element which is usually the row number itself

          // Capture styles ( the logic here should probably be wrong, THIS NEEDS REFACTORING FOR EXCEL DISPLAY TO LOOK GOOD)
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (!styles[rowNumber - 1]) styles[rowNumber - 1] = {};
            styles[rowNumber - 1][colNumber - 1] = cell.style;
          });

          jsonData.push(rowValues.slice(0, 16));
        }
      });

      setExportFileData(jsonData);
      setCellStyles(styles);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpdateExcel = async () => {
    if (!blobData) {
      console.log('Currently no file selected.');
      return;
    }

    //worksheet will be taken and looped through template Config
    const arrayBuffer = await readBlobAsArrayBuffer(blobData);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];

    const updatedExcelConfig = templateConfig;
    const updatedCellStyles = cellStyles;

    // Update the worksheet with data and preserve styles
    // passing it templateConfig
    updateWorksheet(
      worksheet,
      exportFileData,
      updatedExcelConfig,
      updatedCellStyles,
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const updatedBlob = new Blob([buffer], {
      type: 'application/octet-stream',
    });

    const url = window.URL.createObjectURL(updatedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_file.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    getExcelTemplateFiles();
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
          <button onClick={handleUpdateExcel}>Update Excel File</button>
        </div>
      )}
    </div>
  );
}
