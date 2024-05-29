import {
    CssBaseline, StyledEngineProvider, ThemeProvider
} from '@mui/material';
import SessionProvider from "./providers/SessionProvider.tsx";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Lists from "./pages/Lists.tsx";
import theme from "./theme.ts";
import Landing from "./pages/Landing.tsx";
import Layout from "./pages/Layout.tsx";

const App = () => {

    const router = createHashRouter(
        [
            {
                element: <Layout/>,
                children: [
                    {path: "", element: <Landing/>}
                ]
            },
            {
                element: <Layout/>,
                children: [
                    {path: "/lists", element: <Lists/>}
                ]
            }

        ]
    )

    return (
        <CssBaseline>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <SessionProvider>
                        <RouterProvider router={router}/>
                    </SessionProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </CssBaseline>
    )
}

export default App;
