import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Button, IconButton } from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";

export default function ResultListNavBar() {
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" px={8} py={7.5}>
        <Box
          display="flex"
          flexDirection="row"
          columnGap={2.5}
          alignItems="center"
        >
          <IconButton aria-label="back">
            <ArrowBack sx={{ color: "black" }} />
          </IconButton>
          <Typography fontSize={28} fontWeight={400}>
            My reef slates
          </Typography>
        </Box>
        {/* <RoundedButton itemType="" variant="contained">
          Export
        </RoundedButton> */}
      </Box>
    </Container>
  );
}
