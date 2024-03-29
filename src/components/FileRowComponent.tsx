import Box from "@mui/material/Box";
import InputFileUpload from "./InputFileUpload";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Fragment, useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Divider, Typography, useMediaQuery } from "@mui/material";
import theme from "@/theme";
import { FileRow, useFileRowStore } from "@/stores/fileRowStore";

interface FileRowComponentProps {
  index: number;
  row: FileRow;
}

function FileRowCollapsibleControl({
  index,
  open,
  rowId,
  setOpen,
}: {
  index: number;
  open: boolean;
  rowId: string;
  setOpen: (state: boolean) => void;
}) {
  const removeRow = useFileRowStore((state) => state.removeRow);
  return (
    <Box
      onClick={() => setOpen(!open)}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      columnGap={2.5}
      pt={4}
      px={4}
      sx={{
        backgroundColor: "primary.light",
        display: { xs: "flex", md: "none" },
        cursor: "pointer",
      }}
    >
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        {open ? <ArrowDropUp /> : <ArrowDropDown />}
        <Typography>Set {index + 1}</Typography>
      </Box>
      <Divider
        variant="middle"
        orientation="horizontal"
        color="black"
        sx={{ height: "1px", flex: 1 }}
      />
      <IconButton
        aria-label="delete"
        onClick={() => removeRow(rowId)}
        sx={{ ml: -2.5 }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
}

export default function FileRowComponent(props: FileRowComponentProps) {
  const { index, row } = props;
  const removeRow = useFileRowStore((state) => state.removeRow);
  const [open, setOpen] = useState<boolean>(true);
  const isLargerScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Fragment>
      <FileRowCollapsibleControl
        index={index}
        open={open}
        rowId={row.id}
        setOpen={setOpen}
      />
      {/** IF is not on mobile, always show this box
       * IF it's not, meaning on mobile, check if it's open */}
      {isLargerScreen || open ? (
        <Box
          display="flex"
          sx={{ backgroundColor: "primary.light", padding: "10px 40px" }}
          alignItems="center"
          columnGap={2.5}
        >
          <Box
            display="flex"
            sx={{ flex: 1, flexDirection: { xs: "column", md: "row" } }}
            columnGap={2.5}
            justifyContent="space-between"
          >
            <InputFileUpload rowId={row.id} slate={row.substrate} />
            <InputFileUpload rowId={row.id} slate={row.fishInverts} />
          </Box>
          <IconButton
            aria-label="delete"
            onClick={() => removeRow(row.id)}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Delete />
          </IconButton>
        </Box>
      ) : (
        <></>
      )}
    </Fragment>
  );
}
