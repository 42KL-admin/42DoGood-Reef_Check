"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckmarkChip from "@/components/CheckmarkChip";
import { RoundedButton } from "@/components/RoundedButton";
import DropdownMenu from "@/components/DropdownMenu";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { Fragment, useContext } from "react";
import { SlateContext } from "@/contexts";
import NavBar from "@/components/mobile/NavBar";

const ChipLabels = ["Not blurry", "Bright enough", "Pencil writing is clear"];

/**
 * 1. Remove those row with no values (substrate & fistInverts === null)
 * 2. Rows with values (either one), convert them. Set status to processing.
 * 3. Those that can be converted successfully, set status to success else failed.
 *
 * convert again:
 * 1. those that are success, move to "view results", make it hidden from list? (both success)
 * 2. those that has one slate success, stay in the list
 */

export default function UploadPhotoHeroSection() {
  const router = useRouter();
  const { rows } = useContext(SlateContext);
  return (
    <Fragment>
      <NavBar />
      <Container maxWidth="xl">
        <Box
          display="grid"
          justifyItems="center"
          rowGap={8}
          px={6}
          pt={4}
          pb={{ xs: 0, md: 15 }}
          mt={{ xs: 20, md: 0 }}
        >
          <Box
            justifySelf="end"
            sx={{ py: 1, display: { xs: "none", md: "block" } }}
          >
            <DropdownMenu />
          </Box>
          <Box rowGap={4} display="grid" justifyItems="center">
            <Box rowGap={2} display="grid">
              <Typography
                variant="h5"
                align="center"
                sx={{ display: { xs: "none", md: "block" } }}
              >
                Upload your slates photo
              </Typography>
              <Typography
                variant="h4"
                align="center"
                sx={{ fontSize: { xs: "14px", sm: "24px", md: "32px" } }}
              >
                Make sure that your photos are:
              </Typography>
            </Box>
            <Box
              display="flex"
              columnGap={2}
              flexWrap={"wrap"}
              justifyContent={"center"}
              sx={{ rowGap: { xs: 2, md: 0 } }}
            >
              {ChipLabels.map((chipLabel) => (
                <CheckmarkChip label={chipLabel} key={chipLabel} />
              ))}
            </Box>
          </Box>
          <Box
            display="flex"
            columnGap={2.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <RoundedButton
              variant="contained"
              size="large"
              onClick={() => console.log(rows)}
            >
              convert files now
            </RoundedButton>
            <RoundedButton
              itemType="secondary"
              variant="outlined"
              size="large"
              onClick={() => router.push("/results")}
            >
              view results
            </RoundedButton>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
