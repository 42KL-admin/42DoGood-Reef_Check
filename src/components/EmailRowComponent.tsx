import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { Fragment, useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Divider, TextField, Typography, useMediaQuery } from "@mui/material";
import theme from "@/theme";
import { EmailRow, EmailRole } from "@/stores/types";
import { useEmailRowStore } from "@/stores/emailRowStore";
import Dropdownpermission from "./Dropdownpermission";
import { useRouter } from "next/navigation";

interface EmailRowComponentProps {
  index: number;
  row: EmailRow;
  email: string;
}

function EmailRowCollapsibleControl({
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
  const removeRow = useEmailRowStore((state) => state.removeRow);
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

export default function EmailRowComponent(props: EmailRowComponentProps) {
  const { index, row, email } = props;
  const updateRole = useEmailRowStore((state) => state.updateRole);
  const removeRow = useEmailRowStore((state) => state.removeRow);
  const [open, setOpen] = useState<boolean>(true);
  const isLargerScreen = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();

  const handleRemoveRow = async () => {
	try {
		const response = await fetch('/api/admin/Dashboard', {
		  method: 'DELETE',
		  body: JSON.stringify({ email: row.email }),
		});
		const payload = await response.json();
  
		if (response.status === 200) {
			removeRow(row.email);
		} else {
		  console.error('Error:', payload.message);
		  router.replace('/');
		}
	  } catch {
		console.error('Error: Remove row fail');
	  }
	};

  const handlePermissionChange = async (role: EmailRole) => {
    try {
      const response = await fetch('/api/admin/Dashboard', {
        method: 'PUT',
        body: JSON.stringify({ email: row.email, role }),
      });
      const payload = await response.json();

      if (response.status === 200) {
        updateRole(row.email, role);
      } else {
        console.error('Error:', payload.message);
		router.replace('/');
      }
    } catch {
      console.error('Error: Permission Change fail');
    }
  };

  return (
    <Fragment>
      <EmailRowCollapsibleControl
        index={index}
        open={open}
        rowId={row.email}
        setOpen={setOpen}
      />
      {/** IF is not on mobile, always show this box
       * IF it's not, meaning on mobile, check if it's open */}
      {isLargerScreen || open ? (
        <Box
          style={{ 
          borderBottom: '1px solid #ccc',
          }}
          display="flex"
          sx={{ padding: "12px 40px" }}
          alignItems="center"
          columnGap={2.5}
        >
          <Box
            sx={{ flex: 1, flexDirection: { xs: "column", md: "row" } ,fontFamily: 'Roboto', fontSize: "16 px",}}
            justifyContent="space-between"
          >
            {email}
          </Box>
          <Dropdownpermission 
            initialPermission={row.role}
            onChange={handlePermissionChange}
            borderColor="white">
          </Dropdownpermission>
          <IconButton
            aria-label="delete"
            onClick={() => handleRemoveRow()}
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
