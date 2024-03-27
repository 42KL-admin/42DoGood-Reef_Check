import { Close, Height, Menu } from "@mui/icons-material";
import Drawer from "@mui/material/Drawer";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Fragment>
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
            <Typography variant="h6" color="black" align="center" width="100%">
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
              onClick={toggleDrawer(true)}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="top"
        sx={{
          backgroundColor: "primary",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            height: "100vh",
            width: "100%",
            backgroundColor: "#006878",
            borderBottomLeftRadius: "30px",
            borderBottomRightRadius: "30px",
          },
        }}
      >
        <Box
          display={"flex"}
          flexDirection="column"
          height={"100%"}
          pt={10}
          pb={10}
        >
          <Box
            sx={{ flexGrow: 1 }}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Link
              href={"/upload"}
              style={{ textDecoration: "none", color: "white" }}
              onClick={toggleDrawer(false)}
            >
              <Typography py={4} letterSpacing={2} align="center">
                Convert Slates
              </Typography>
            </Link>
            <Link
              href={"/results"}
              style={{ textDecoration: "none", color: "white" }}
              onClick={toggleDrawer(false)}
            >
              <Typography py={4} letterSpacing={2} align="center">
                View My Slates
              </Typography>
            </Link>
            <Link
              href={"/upload"}
              style={{ textDecoration: "none", color: "white" }}
              onClick={toggleDrawer(false)}
            >
              <Typography py={4} letterSpacing={2} align="center">
                Sign Out
              </Typography>
            </Link>
          </Box>
          <Box
            mt={"auto"}
            bottom={0}
            display={"flex"}
            flexDirection={"column"}
            rowGap={8}
            alignItems={"center"}
          >
            <Typography
              align="center"
              fontSize={"16px"}
              color={"white"}
              fontWeight={400}
              letterSpacing={1}
            >
              Signed in as:
              <br />
              user@email.com
            </Typography>
            <IconButton
              sx={{ width: "fit-content", color: "white" }}
              onClick={toggleDrawer(false)}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Fragment>
  );
}
