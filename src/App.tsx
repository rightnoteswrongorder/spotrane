import SessionProvider from "./providers/SessionProvider.tsx";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Lists from "./pages/Lists.tsx";
import Layout from "./pages/Layout.tsx";
import NoOp from "./pages/NoOp.tsx";
import Library from "./pages/Library.tsx";


const App = () => {


    const router = createHashRouter(
        [
            {
                element: <Layout/>,
                children: [
                    {path: "", element: <Library/>}
                ],
                errorElement: <NoOp/>
            },
            {
                element: <Layout/>,
                children: [
                    {
                        path: "/lists",
                        element: <Lists/>
                    }
                ],
                errorElement: <NoOp/>
            },
            {
                element: <Layout/>,
                children: [
                    {path: "/lists/:listName", element: <Lists/>}
                ],
                errorElement: <NoOp/>
            }
        ]
    )

    return (
        <SessionProvider>
            <RouterProvider router={router}/>
        </SessionProvider>
    )
}

export default App;
