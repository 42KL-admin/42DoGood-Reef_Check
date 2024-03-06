import { useState } from "react";
import { Row, SlateType } from "./types";

const useRowControls = () => {
  // default is just one row
  const [rows, setRows] = useState<Row[]>([]);

  const createRow = (): Row => {
    console.log("created");
    return {
      substrate: {
        type: "substrate",
        file: null,
        error: null,
        setFile: (file: File) => {},
        clearFile: () => {},
      },
      fishInverts: {
        type: "fishInverts",
        file: null,
        error: null,
        setFile: (file: File) => {},
        clearFile: () => {},
      },
    };
  };

  const addRow = () => {
    setRows([...rows, createRow()]);
  };

  const removeRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  // handle upload file
  const setSlateFile =
    (index: number, type: SlateType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];

      if (!selectedFile) return;

      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        const targetRow = { ...updatedRows[index] };
        const targetSlateKey =
          type === "substrate" ? "substrate" : "fishInverts";

        if (targetSlateKey in targetRow) {
          // deep copy the target Slate to ensure immutability
          const targetSlate = { ...targetRow[targetSlateKey] };
          targetSlate.file = selectedFile;

          // update the targetRow with the modified slate
          const updatedRow = { ...targetRow, [targetSlateKey]: targetSlate };
          updatedRows[index] = updatedRow;

          return updatedRows;
        }

        // sanity check: if slate type is not recognized, return the previous slate
        return prevRows;
      });
    };

  const unsetSlateFile = (index: number, type: SlateType) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const targetRow = { ...updatedRows[index] };
      const targetSlateKey = type === "substrate" ? "substrate" : "fishInverts";

      if (targetSlateKey in targetRow) {
        // deep copy the target Slate to ensure immutability
        const targetSlate = { ...targetRow[targetSlateKey] };
        targetSlate.file = null;

        // update the targetRow with the modified state
        const updatedRow = { ...targetRow, [targetSlateKey]: targetSlate };
        updatedRows[index] = updatedRow;

        return updatedRows;
      }

      // sanity check: if slate type is not recognized, return the previous slate
      return prevRows;
    });
  };

  if (rows.length === 0) {
    setRows([createRow()]);
  }

  // updateFile
  return {
    rows,
    addRow,
    removeRow,
    setSlateFile,
    unsetSlateFile
  };
};

export default useRowControls;
