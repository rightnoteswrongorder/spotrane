import {useSpotify} from "./hooks/useSpotfy.ts";
import {Scopes} from "@spotify/web-api-ts-sdk";
import {
    Box, CircularProgress
} from '@mui/material';
import LoginForm from "./pages/LoginForm.tsx";
import {useSession} from "./providers/SessionProvider.tsx";
import Library from "./pages/Library.tsx";

function App() {

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const {session, loading} = useSession()

    let landing = <></>

    if (loading) {
        landing = <Box
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
    } else {
        landing = !session ? <LoginForm/> : <Box sx={{flexGrow: 1}}>
            <Library sdk={sdk}/></Box>
    }

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            {landing}
        </div>
    )
}

export default App;
