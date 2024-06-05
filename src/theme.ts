import {createTheme} from "@mui/material";
import {orange} from "@mui/material/colors";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}
const baseTheme = createTheme({
    typography: {
        fontFamily: ['Nunito', 'serif'].join(','),
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#1db954',
        },
        secondary: {
            main: '#f50057',
        },
    },
    status: {
        danger: orange[500],
    },
});

export default baseTheme;