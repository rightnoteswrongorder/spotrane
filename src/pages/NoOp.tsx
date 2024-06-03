import Grid from "@mui/material/Grid";
import {Box, Typography} from "@mui/material";

export default function NoOp() {

    return (
        <Grid container spacing={2}>
            <Grid xs={12} item={true}>
            </Grid>
            <Grid xs={12} item={true}>
                <Box><Typography>Nothing to see here...</Typography></Box>
            </Grid>
        </Grid>
    )
}

