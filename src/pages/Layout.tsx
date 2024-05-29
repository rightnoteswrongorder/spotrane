import MenuBar from "./components/MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {Outlet} from "react-router-dom";

export default function Layout() {


    return (
        <Grid container spacing={2}>
            <Grid xs={12} item={true}>
                <MenuBar/>
            </Grid>
            <Grid xs={12} item={true}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}

