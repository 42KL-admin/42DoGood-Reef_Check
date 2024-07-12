import { create } from 'zustand';

type SnackbarSeverity = 'error' | 'info' | 'warning' | 'success';

type SnackbarMessage = {
    message: string;
    key: number;
    severity: SnackbarSeverity;
}

type SnackbarState = {
    messages: SnackbarMessage[];
    addMessage: (message: string, severity: SnackbarSeverity) => void;
    removeMessage: (key: number) => void;
}

const useSnackbarStore = create<SnackbarState>((set) => ({
    messages: [],
    addMessage: (message: string, severity: SnackbarSeverity) => {
        set((state) => ({
            messages: [
                ...state.messages,
                { message, severity, key: new Date().getTime() },
            ],
        }));
    },
    removeMessage: (key: number) => {
        set((state) => ({
            messages: state.messages.filter((msg) => msg.key !== key),
        }));
    },
}));

export default useSnackbarStore;