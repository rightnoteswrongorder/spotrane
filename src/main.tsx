import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {CssBaseline, StyledEngineProvider, ThemeProvider} from "@mui/material";
import SessionProvider from "./providers/SessionProvider.tsx";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Library from "./components/Library.tsx";
import theme from "./theme.ts";

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
