"use client";

import { ArrowBack, Close, Menu } from "@mui/icons-material";
import Drawer from "@mui/material/Drawer";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLoggedUserStateStore } from "@/stores/loggedUserStore";
import { deleteSession } from "@/services/sessionApi";
import useSnackbarStore from "@/stores/snackbarStore";

interface BurgerMenuProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
}

function BurgerMenu(props: BurgerMenuProps) {
  const { open, setOpen } = props;
  const user = useLoggedUserStateStore((state) => state.user);
  const setLoggedUserState = useLoggedUserStateStore(
    (state) => state.setLoggedUserState,
  );
  const addMessage = useSnackbarStore((state) => state.addMessage);
  const router = useRouter();

  const logoutUser = async () => {
    try {
      const role = user?.role;
      setLoggedUserState(null);
      if (role == 'admin') {
        deleteSession()
          .then(() => {
            setOpen(false);
            router.push('/');
          });
      } else {
        setOpen(false);
        router.push('/');
      }
      addMessage("Logout successfully.", 'success');
    } catch (e: any) {
      addMessage(e.message, 'error');
    }
  };

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
          <Button
            style={{ textDecoration: "none", color: "white", textTransform: "capitalize" }}
            onClick={() => {
              router.push('/upload');
              setOpen(false);
            }}
          >
            <Typography py={4} letterSpacing={2} align="center" textTransform={"capitalize"}>
              Upload Slates
            </Typography>
          </Button>
          <Button
            style={{ textDecoration: "none", color: "white", textTransform: "capitalize" }}
            onClick={() => {
              router.push('/results');
              setOpen(false);
            }}
          >
            <Typography py={4} letterSpacing={2} align="center" textTransform={"capitalize"}>
              View Results
            </Typography>
          </Button>
          <Button
            style={{ textDecoration: "none", color: "white", textTransform: "capitalize" }}
            onClick={logoutUser}
          >
            <Typography py={4} letterSpacing={2} align="center" textTransform={"capitalize"}>
              Logout
            </Typography>
          </Button>
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
            { user?.email || 'user@gmail.com' }
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
