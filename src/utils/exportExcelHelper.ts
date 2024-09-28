import { getExcelTemplateSasTokenCookie } from '@/services/excelTemplateSasTokenApi';
import ExcelJS, { Workbook } from 'exceljs';
import { fetchTemplateFromBlobStorage } from './azureBlobStorageHelper';
import { SlateState } from '@/stores/types';

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
export function getSlateConfig(
  type: 'substrate' | 'fishInverts',
  isOcrResultsConfig?: boolean,
) {
  return isOcrResultsConfig ? OcrResultsConfig[type] : SlateTypeConfig[type];
}

// Helper function to convert readable stream to buffer
export async function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
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

export const handleUpdateExcel = async (
  blobData: Blob | null,
  templateConfig: SlateConfig.SlateConfig,
  cellStyles: any = {},
  exportFileData: (string | number)[][] = [],
  fileName: string,
) => {
  if (!blobData) {
    console.log('Currently no file selected.');
    return;
  }

  console.log(cellStyles, exportFileData);

  //worksheet will be taken and looped through template Config
  const arrayBuffer = await readBlobAsArrayBuffer(blobData); // blob data get from slate
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
  a.download = `${fileName.split(' ').filter(Boolean).join('_')}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export function extractApiDataFromWorksheet(
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

// Eulee: I might be doing more than just "getExcelTemplatefiles"
// will throw
export const getExcelTemplateFiles = async (
  slate: SlateState,
  templateConfig: SlateConfig.SlateConfig,
) => {
  //   try {
  const sasToken = await getExcelTemplateSasTokenCookie();

  // console.log('SasToken generated successfully: ', sasToken);

  const blobFromStorage = await fetchTemplateFromBlobStorage(
    sasToken.value,
    slate.type,
  );

  if (slate.excelFile) {
    // console.log('Excel Blob Data: ', props.excelBlobData);

    const apiArrayBuffer = await readBlobAsArrayBuffer(slate.excelFile);
    const apiWorkbook = new ExcelJS.Workbook();
    await apiWorkbook.xlsx.load(apiArrayBuffer);

    const apiConfig = getSlateConfig(slate.type, true);
    const { extractedData: apiData, styles: apiStyles } =
      extractApiDataFromWorksheet(apiWorkbook, apiConfig);

    const templateArrayBuffer = await readBlobAsArrayBuffer(blobFromStorage);
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

    return updatedBlob;
  }
};

export async function parseBlobData(
  blob: Blob,
  templateConfig: SlateConfig.SlateConfig,
) {
  const arrayBuffer = await readBlobAsArrayBuffer(blob);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const { extractedData, styles } = extractApiDataFromWorksheet(
    workbook,
    templateConfig,
  );

  return { extractedData: extractedData, styles };
}
