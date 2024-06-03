import MenuBar from "./components/MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {Outlet} from "react-router-dom";
import {useSession} from "../providers/SessionProvider.tsx";
import PageLoadSpinner from "./components/PageLoadSpinner.tsx";
import LoginForm from "./LoginForm.tsx";
import {SupabaseApi} from "../api/supabase.ts";

export default function Layout() {
    const {session, loading, clearSession} = useSession()

    let outlet = <PageLoadSpinner/>;

    if (!loading) {
        outlet = !session ? <LoginForm/> : <Outlet/>
    }

    const logout = () => {
        return (async () => {
            await SupabaseApi.signOut();
            clearSession();
        })();
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={12} item={true}>
                <MenuBar logout={logout}/>
            </Grid>
            <Grid xs={12} item={true}>
                {outlet}
            </Grid>
        </Grid>
    )
}

