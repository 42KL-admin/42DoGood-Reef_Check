// src/theme.ts
'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#006878',
      light: '#F5FAFC',
    },
    secondary: {
      main: '#7C959C',
    },
    warning: {
      main: '#FFBD4B',
    },
    error: {
      main: '#FF5449',
    },
  },
  spacing: 4,
});

export default theme;