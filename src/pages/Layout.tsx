import MenuBar from "./components/MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {Outlet} from "react-router-dom";
import {Session} from "@supabase/supabase-js";

type LayoutProps = {
    session: Session | undefined
}

export default function Layout({session}: LayoutProps) {


    return (
        <Grid container spacing={2}>
            <Grid xs={12} item={true}>
                <MenuBar session={session}/>
            </Grid>
            <Grid xs={12} item={true}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}

