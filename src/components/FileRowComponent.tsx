import Box from "@mui/material/Box";
import InputFileUpload from "./InputFileUpload";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Row } from "@/hooks/upload/types";
import { Fragment, useContext, useState } from "react";
import { SlateContext } from "@/contexts";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Divider, Typography, useMediaQuery } from "@mui/material";
import theme from "@/theme";

interface FileRowComponentProps {
  index: number;
  row: Row;
}

function FileRowCollapsibleControl({
  index,
  open,
  setOpen,
}: {
  index: number;
  open: boolean;
  setOpen: (state: boolean) => void;
}) {
  const { removeRow } = useContext(SlateContext);
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
        onClick={() => removeRow(index)}
        sx={{ ml: -2.5 }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
}

export default function FileRowComponent(props: FileRowComponentProps) {
  const { index, row } = props;
  const { removeRow } = useContext(SlateContext);
  const [open, setOpen] = useState<boolean>(true);
  const isLargerScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Fragment>
      <FileRowCollapsibleControl index={index} open={open} setOpen={setOpen} />
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
            <InputFileUpload index={index} slate={row.substrate} />
            <InputFileUpload index={index} slate={row.fishInverts} />
          </Box>
          <IconButton
            aria-label="delete"
            onClick={() => removeRow(index)}
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
