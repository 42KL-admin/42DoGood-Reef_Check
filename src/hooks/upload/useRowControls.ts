import { useState } from "react";
import { Row } from "./types";

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

  if (rows.length === 0) {
    setRows([createRow()]);
  }

  // updateFile
  return {
    rows,
    addRow,
    removeRow,
  };
};

export default useRowControls;
