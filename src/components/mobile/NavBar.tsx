"use client";

import { ArrowBack, Close, Menu } from "@mui/icons-material";
import Drawer from "@mui/material/Drawer";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface BurgerMenuProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
}

function BurgerMenu(props: BurgerMenuProps) {
  const { open, setOpen } = props;

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
          >
            <Typography py={4} letterSpacing={2} align="center">
              Convert Slates
            </Typography>
          </Link>
          <Link
            href={"/results"}
            style={{ textDecoration: "none", color: "white" }}
            onClick={() => setOpen(false)}
          >
            <Typography py={4} letterSpacing={2} align="center">
              View My Slates
            </Typography>
          </Link>
          <Link
            href={"/upload"}
            style={{ textDecoration: "none", color: "white" }}
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const getNavBarTitle = () => {
    switch (pathname) {
      case "/upload":
        return "Upload";
      case "/results":
        return "View Results";

      default:
        return "";
    }
  };

  return (
    <Fragment>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "white",
          display: { sm: "block", md: "none" },
          zIndex: 999,
          width: "100%",
        }}
      >
        <AppBar
          sx={{ backgroundColor: "white", padding: "14px 35px" }}
          elevation={0}
        >
          <Toolbar sx={{ position: "relative" }}>
            {pathname !== "/upload" && (
              <IconButton
                sx={{
                  color: "black",
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                size="large"
                onClick={() => router.push("/upload")}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant="h6" color="black" align="center" width="100%">
              {getNavBarTitle()}
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
              onClick={() => setOpen(true)}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <BurgerMenu open={open} setOpen={setOpen} />
    </Fragment>
  );
}
