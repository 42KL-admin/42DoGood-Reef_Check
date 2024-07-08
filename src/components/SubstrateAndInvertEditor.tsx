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
  excelBlobData: Blob | File | null;
}

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
  substrateExtracted: {
    rowNumberFrom: 13,
    rowNumberTo: 34,
    numberOfColumns: 16,
    ignoredRows: [],
    ignoredCols: [],
  },
});

function getSlateConfig(type: 'substrate' | 'fishInverts') {
  return SlateTypeConfig[type];
}

function extractDataFromWorksheet(
  workbook: Workbook,
  config: SlateConfig.SlateConfig,
): { data: (string | number)[][]; styles: any } {
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

        // Capture styles
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (!styles[rowNumber - 1]) styles[rowNumber - 1] = {};
          styles[rowNumber - 1][colNumber - 1] = cell.style;
        });

        jsonData.push(rowValues.slice(0, config.numberOfColumns));
      }
    }
  });

  return { data: jsonData, styles };
}

export default function SubstrateAndInvertEditor(props: ExportEditorProps) {
  const [data, setData] = useState<(string | number)[][]>([]);
  const [ocrData, setOcrData] = useState<(string | number)[][]>([]);
  const [blobData, setBlobData] = useState<Blob | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [cellStyles, setCellStyles] = useState<any>({});

  const config: SlateConfig.SlateConfig = getSlateConfig(props.type);

  // Function to fetch data from Azure Blob Storage for a specific template
  const getExcelTemplateFiles = async () => {
    try {
      const sasToken = await getExcelTemplateSasTokenCookie();

      console.log('SasToken generated successfully: ', sasToken);

      // setting my blob
      const blobFromStorage = await fetchTemplateFromBlobStorage(
        sasToken.value,
        props.type,
      );
      setBlobData(blobFromStorage);
      // parse
      // await parseOcrData();
      await parseBlobData(blobFromStorage);
    } catch (error) {
      console.error('Error in function getExcelTemplateFiles: ', error);
    }
  };

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

  async function parseOcrData(blob: Blob) {
    try {
      // getting Excel Data
      const arrayBuffer = await readBlobAsArrayBuffer(blob);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const { data, styles } = extractDataFromWorksheet(workbook, config);

      setOcrData(data);
    } catch (error) {
      console.error('Error processing Excel file:', error);
    }
  }

  async function parseBlobData(blob: Blob) {
    try {
      // getting Excel Data
      const arrayBuffer = await readBlobAsArrayBuffer(blob);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const { data, styles } = extractDataFromWorksheet(workbook, config);

      setData(data);
      setCellStyles(styles);
    } catch (error) {
      console.error('Error processing Excel file:', error);
    }

    // async function parseBlobData(blob: Blob) {
    //   try {
    //     const arrayBuffer = await readBlobAsArrayBuffer(blob);
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.load(arrayBuffer);

    //     const worksheet = workbook.worksheets[0]; // Assuming the first sheet
    //     const jsonData: (string | number)[][] = [];
    //     const styles: any = {};

    //     worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    //       if (
    //         rowNumber >= config.rowNumberFrom &&
    //         rowNumber <= config.rowNumberTo
    //       ) {
    //         if (config.ignoredRows.includes(rowNumber)) {
    //           jsonData.push(Array(config.numberOfColumns).fill(null)); // Placeholder for ignored rows
    //         } else {
    //           const rowValues = row.values as (string | number)[];
    //           rowValues.shift(); // Remove the first element which is usually the row number itself

    //           // Capture styles
    //           row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    //             if (!styles[rowNumber - 1]) styles[rowNumber - 1] = {};
    //             styles[rowNumber - 1][colNumber - 1] = cell.style;
    //           });

    //           jsonData.push(rowValues.slice(0, config.numberOfColumns));
    //         }
    //       }
    //     });

    //     setData(jsonData);
    //     setCellStyles(styles);
    //   } catch (error) {
    //     console.error('Error processing Excel file:', error);
    //   }
    // }

    // File Upload function that was previously used.
    // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files?.[0];
    //   if (!file) return;

    //   const reader = new FileReader();

    //   reader.onload = async (event) => {
    //     const arrayBuffer = event.target?.result as ArrayBuffer;
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.load(arrayBuffer);

    //     const worksheet = workbook.worksheets[0]; // Assuming the first sheet
    //     const jsonData: (string | number)[][] = [];
    //     const styles: any = {};

    //     worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    //       // Extract rows 13 to 34
    //       if (rowNumber >= 13 && rowNumber <= 34) {
    //         const rowValues = row.values as (string | number)[];
    //         rowValues.shift(); // Remove the first element which is usually the row number itself

    //         // Capture styles
    //         row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    //           if (!styles[rowNumber - 1]) styles[rowNumber - 1] = {};
    //           styles[rowNumber - 1][colNumber - 1] = cell.style;
    //         });

    //         jsonData.push(rowValues.slice(0, 16));
    //       }
    //     });

    //     setData(jsonData);
    //     setCellStyles(styles);
    //   };

    //   reader.readAsArrayBuffer(file);
    // };

    // const handleUpdateExcel = async () => {
    //   if (!fileInputRef.current?.files?.[0]) {
    //     console.log('Currently no file selected.');
    //     return;
    //   }
    //   const file = fileInputRef.current.files[0];

    //   const reader = new FileReader();

    //   reader.onload = async (event) => {
    //     const arrayBuffer = event.target?.result as ArrayBuffer;
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.load(arrayBuffer);

    //     const worksheet = workbook.worksheets[0];

    //     // Update the worksheet with data and preserve styles
    //     data.forEach((row, rowIndex) => {
    //       row.forEach((cell, colIndex) => {
    //         const cellRef = worksheet.getCell(rowIndex + 13, colIndex + 1); // Update rows 13-34

    //         cellRef.value = cell;
    //         if (cellStyles[rowIndex] && cellStyles[rowIndex][colIndex]) {
    //           cellRef.style = cellStyles[rowIndex][colIndex];
    //         }
    //       });
    //     });

    //     const buffer = await workbook.xlsx.writeBuffer();
    //     const updatedBlob = new Blob([buffer], {
    //       type: 'application/octet-stream',
    //     });

    //     const url = window.URL.createObjectURL(updatedBlob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'updated_file.xlsx';
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   };

    //   reader.readAsArrayBuffer(file);
    // };

    React.useEffect(() => {
      getExcelTemplateFiles();
    }, []);
  }

  const handleUpdateExcel = async () => {
    if (!blobData) {
      console.log('Currently no file selected.');
      return;
    }

    const arrayBuffer = await readBlobAsArrayBuffer(blobData);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];

    // Update the worksheet with data and preserve styles
    data.forEach((row, rowIndex) => {
      const actualRowIndex = rowIndex + config.rowNumberFrom;

      if (config.ignoredRows.includes(actualRowIndex)) {
        return; // Skip the ignored row
      }

      row.forEach((cell, colIndex) => {
        if (config.ignoredCols.includes(colIndex + 1)) {
          console.log('entered');
          return; // Skip the ignored column
        }

        const cellRef = worksheet.getCell(actualRowIndex, colIndex + 1);

        cellRef.value = cell;
        if (cellStyles[rowIndex] && cellStyles[rowIndex][colIndex]) {
          cellRef.style = cellStyles[rowIndex][colIndex];
        }
      });
    });

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

  return (
    <div>
      {/* <input type="file" ref={fileInputRef} onChange={handleFileUpload} /> */}
      {data.length > 0 && (
        <div>
          <HotTable
            data={data}
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
