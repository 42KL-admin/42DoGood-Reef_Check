"use client";

import { SelectedSlateContext } from "@/contexts";
import { Add, Remove, ZoomIn } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Image from "next/image";
import { useContext, useEffect } from "react";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";

function EditControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Box
      display="grid"
      justifyContent="center"
      sx={{
        backgroundColor: "transparent",
        width: "100%",
        height: "fit-content",
        position: "absolute",
        bottom: "24px",
      }}
      py={2.5}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space"
        columnGap={5}
        width="fit-content"
        sx={{
          backgroundColor: "white",
          px: 2.5,
          py: 1,
          borderRadius: 10,
        }}
      >
        <IconButton aria-label="zoom out" onClick={() => zoomOut()}>
          <Remove htmlColor="black" />
        </IconButton>
        <IconButton aria-label="reset" onClick={() => resetTransform()}>
          <ZoomIn htmlColor="black" />
        </IconButton>
        <IconButton aria-label="zoom in" onClick={() => zoomIn()}>
          <Add htmlColor="black" />
        </IconButton>
      </Box>
    </Box>
  );
}

function EditImagePreview() {
  const { slate } = useContext(SelectedSlateContext);

  return (
    <Box
      width="100%"
      display="grid"
      alignContent={"center"}
      justifyContent={"center"}
    >
      <TransformWrapper>
        <TransformComponent>
          <img
            src={`data:image/png;base64,${slate?.base64}`}
            alt=""
            style={{ objectFit: "cover" }}
          />
        </TransformComponent>
        <EditControls />
      </TransformWrapper>
    </Box>
  );
}

export default function EditSlateComponent() {
  const { slate } = useContext(SelectedSlateContext);

  useEffect(() => {
    console.log("edit", slate);
  }, [slate]);

  return slate ? (
    <Box display="flex" height={"100vh"}>
      <Box
        width={"50%"}
        display="grid"
        justifyItems="center"
        sx={{ position: "relative" }}
      >
        <EditImagePreview />
      </Box>
      <Box width={"50%"} sx={{ backgroundColor: "teal" }}></Box>
    </Box>
  ) : (
    <></>
  );
}
