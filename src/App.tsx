import {
    CssBaseline, StyledEngineProvider, ThemeProvider
} from '@mui/material';
import SessionProvider, {useSession} from "./providers/SessionProvider.tsx";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Lists from "./pages/Lists.tsx";
import theme from "./theme.ts";
import Landing from "./pages/Landing.tsx";
import Layout from "./pages/Layout.tsx";

const App = () => {

    const {session, loading} = useSession()

    const router = createHashRouter(
        [
            {
                element: <Layout session={session}/>,
                children: [
                    {path: "", element: <Landing loading={loading} session={session}/>}
                ]
            },
            {
                element: <Layout session={session}/>,
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
