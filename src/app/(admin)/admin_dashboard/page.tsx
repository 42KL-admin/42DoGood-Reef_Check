"use client";

import EmailRowComponent from "@/components/EmailRowComponent";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { Divider } from "@mui/material";
import { Collapse, Drawer } from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { useEmailRowStore } from "@/stores/emailRowStore";
import {EmailPermission } from "@/stores/types";
import SortByPermission from "@/components/SortbyPermission";

export default function UploadEmailSection() {
  const rows = useEmailRowStore((state) => state.rows); // useMemo here

  const [sortByPermission, setSortByPermission] = useState<EmailPermission | null>(null);

  const handleSortByPermission = (permission: EmailPermission | null) => {
    setSortByPermission(permission);
  };

  // Filter rows based on sortByPermission
  const filteredRows = sortByPermission
    ? rows.filter((row) => row.permission === sortByPermission)
    : rows;

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" , borderTop: "1px black"}}>
        <Box
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          style={{ 
          borderBottom: '1px solid #ccc',
          marginBottom: '0px',
          fontFamily: 'Roboto',
          }}
          sx={{ 
            mb: { xs: 50, md: 0 },
            padding: "8px 40px",
            pr: "94px",
            fontSize: "14px",
            fontWeight: "bold",
            }}>
            Email address
            <SortByPermission onSortByPermission={handleSortByPermission} />
        </Box>
        <Box
          display="grid"
          rowGap={2.5}
          maxHeight={{ md: 500 }}
          // overflow="scroll"
          sx={{ mb: { xs: 50, md: 0 } }}
        >
          <TransitionGroup>
            {filteredRows.map((row, index) => (
              <Collapse key={row.email}>
                <EmailRowComponent index={index} row={row} email={row.email}/>
              </Collapse>
            ))}
          </TransitionGroup>
        </Box>
        {/** Drawer here (mobile) */}
      </Container>
    </Box>
  );
}
