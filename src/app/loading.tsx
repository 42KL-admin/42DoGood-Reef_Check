import GradientCircularProgress from "@/components/GradientCircularProgress";
import { Box } from "@mui/material";
import Image from "next/image";

export default function Loading() {
  return (
    <Box sx={{ width: "100%", height: "100%" }} display={"flex"} rowGap={4}>
      <Box
        sx={{ m: "auto" }}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box marginBottom={6}>
          <Image src="/images/logo.png" alt="Logo" width={197} height={171} />
        </Box>
        <GradientCircularProgress />
      </Box>
    </Box>
  );
}
