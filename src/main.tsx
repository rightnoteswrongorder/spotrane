import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {createTheme, CssBaseline, StyledEngineProvider, ThemeProvider} from "@mui/material";
import {orange} from "@mui/material/colors";
import SessionProvider from "./SessionProvider.tsx";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Library from "./Library.tsx";


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

const router = createHashRouter(
    [
        {
            path: "",
            element: <App/>
        },
        {
            path: "/library",
            element: <Library/>
        }

    ]
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CssBaseline>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <SessionProvider>
                        <RouterProvider router={router}/>
                    </SessionProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </CssBaseline>
    </React.StrictMode>,
)
