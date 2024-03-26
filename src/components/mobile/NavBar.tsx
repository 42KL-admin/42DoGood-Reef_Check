import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

export default function NavBar() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "white",
        display: { sm: "block", md: "none" },
        position: "fixed",
        top: 0,
        zIndex: 999,
        width: "100%",
      }}
    >
      <AppBar
        sx={{ backgroundColor: "white", padding: "14px 35px" }}
        elevation={0}
      >
        <Toolbar sx={{ position: "relative" }}>
          <Typography
            variant="h6"
            color="black"
            align="center"
            width="100%"
            // sx={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            Upload
          </Typography>
          <IconButton
            sx={{
              color: "black",
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            size="large"
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
