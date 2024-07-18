'use client'

import useSnackbarStore from "@/stores/snackbarStore"
import { Alert } from "@mui/material";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { SyntheticEvent } from "react";

const GlobalSnackbar: React.FC = () => {
    const { messages, removeMessage } = useSnackbarStore((state) => ({
        messages: state.messages.slice(-3), // show 3 messages at most
        removeMessage: state.removeMessage,
    }));

    const handleClose = (key: number) => (event : Event | SyntheticEvent<any, Event>, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        removeMessage(key);
    }

    return (
        <>
            {messages.map((msg) => (
                <Snackbar
                    key={msg.key}
                    open
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClose={handleClose(msg.key)}
                    id="asdfasdfasdfasdf"
                >
                    <Alert onClose={handleClose(msg.key)} severity={msg.severity}>
                        {msg.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    )
}

export default GlobalSnackbar;