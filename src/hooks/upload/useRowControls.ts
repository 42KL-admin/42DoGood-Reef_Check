import { useState } from "react";
import { Row, SlateState, SlateType } from "./types";

const createSlate = (type: SlateType): SlateState => {
  return {
    type,
    file: null,
    status: "unknown",
  };
};

const createRow = (): Row => {
  return {
    substrate: createSlate("substrate"),
    fishInverts: createSlate("fishInverts"),
  };
};

const useRowControls = () => {
  // default is just one row
  const [rows, setRows] = useState<Row[]>([createRow()]);

  const addRow = () => {
    setRows([...rows, createRow()]);
  };

  const removeRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const updateSlateFile = (
    index: number,
    type: SlateType,
    file: File | null
  ) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const targetRow = { ...updatedRows[index] };
      const targetSlateKey = type === "substrate" ? "substrate" : "fishInverts";

      if (targetSlateKey in targetRow) {
        // deep copy the target Slate to ensure immutability
        const targetSlate = { ...targetRow[targetSlateKey] };
        targetSlate.file = file;

        // update the targetRow with the modified slate
        const updatedRow = { ...targetRow, [targetSlateKey]: targetSlate };
        updatedRows[index] = updatedRow;
      }
      return updatedRows;
    });
  };

  // handle upload file
  const setSlateFile =
    (index: number, type: SlateType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];

      if (!selectedFile) return;

      updateSlateFile(index, type, selectedFile);
    };

  const unsetSlateFile = (index: number, type: SlateType) => {
    updateSlateFile(index, type, null);
  };

  // updateFile
  return {
    rows,
    addRow,
    removeRow,
    setSlateFile,
    unsetSlateFile,
  };
};
``;

export default useRowControls;
