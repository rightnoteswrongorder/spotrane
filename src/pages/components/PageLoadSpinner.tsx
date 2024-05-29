import {Box, CircularProgress} from "@mui/material";

const PageLoadSpinner = () => {
    return <Box
        sx={{
            marginTop: 10,
            width: '100%',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <CircularProgress/>
    </Box>
}

export default PageLoadSpinner