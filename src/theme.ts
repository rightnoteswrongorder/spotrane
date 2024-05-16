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
const theme = createTheme({
    typography: {
        fontFamily: 'Helvetica',
    },
    palette: {
        primary: {
            main: '#1db954',
        },
        secondary: {
            main: '#212121',
        },
    },
    status: {
        danger: orange[500],
    },
});

export default theme;