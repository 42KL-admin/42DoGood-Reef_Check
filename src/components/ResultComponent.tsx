"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MoreActionButton from "./MoreActionButton";
import { Card, CardActionArea, CardActions } from "@mui/material";
import { SlateState } from "@/hooks/upload/types";
import { useContext } from "react";
import { SelectedSlateContext } from "@/contexts";

export default function ResultComponent({ slate }: { slate: SlateState }) {
  const { setSlate } = useContext(SelectedSlateContext);

  return slate.file === null ? (
    <></>
  ) : (
    <Card sx={{ backgroundColor: "primary.light", p: 2.5, boxShadow: 0 }}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        borderRadius={3}
        sx={{ backgroundColor: "white" }}
      >
        <CardActionArea onClick={() => setSlate(slate)}>
          <Box py={6} px={2.5}>
            <Typography sx={{ flex: 1 }}>{slate.file.name}</Typography>
          </Box>
        </CardActionArea>
        <CardActions>
          <MoreActionButton id={slate.id} />
        </CardActions>
      </Box>
    </Card>
  );
}
