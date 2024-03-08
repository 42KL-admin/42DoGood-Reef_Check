import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MoreActionButton from "./MoreActionButton";

export default function ResultComponent() {
  return (
    <Box p={2.5} sx={{ backgroundColor: "primary.light" }}>
      <Box borderRadius={3} sx={{ backgroundColor: "white" }} py={6} px={2.5}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography sx={{ flex: 1 }}>
            slatefile202406221030_substrate.jpg
          </Typography>
          <MoreActionButton />
        </Box>
      </Box>
    </Box>
  );
}
