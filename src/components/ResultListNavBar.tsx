"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ArrowBack from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import theme from "@/theme";
import { ResultTab, useSelectedTabStore } from "@/stores/resultTabStore";
import React from "react";

interface ResultListNavBarProps {
  backToPath: string;
  backAction: () => void;
  title: string;
  ctaButton?: React.ReactNode;
}

function ResultTabList() {
  const selectedTab = useSelectedTabStore((state) => state.tab);
  const setSelectedTab = useSelectedTabStore((state) => state.setSelectedTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue as ResultTab);
  };

  return (
    <Tabs value={selectedTab} onChange={handleChange}>
      <Tab
        label="Slate Picture"
        id="slate-picture-tab"
        value={"slatePicture" as ResultTab}
      />
      <Tab
        label="Excel Sheet"
        id="excel-sheet-tab"
        value={"excelSheet" as ResultTab}
      />
    </Tabs>
  );
}

export default function ResultListNavBar(props: ResultListNavBarProps) {
  const router = useRouter();
  const { backToPath, backAction, title, ctaButton } = props;
  const isLargerScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleBack = () => {
    router.push(backToPath);
    backAction();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 3 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ p: { xs: 2.5, md: 7.5 } }}
      >
        <Box
          display="flex"
          flexDirection="row"
          columnGap={2.5}
          alignItems="center"
        >
          <IconButton aria-label="back" onClick={handleBack}>
            <ArrowBack sx={{ color: "black" }} />
          </IconButton>
          {isLargerScreen && (
            <Typography fontSize={28} fontWeight={400}>
              {title}
            </Typography>
          )}
        </Box>
        {!isLargerScreen && <ResultTabList />}
        {ctaButton}
      </Box>
    </Container>
  );
}
