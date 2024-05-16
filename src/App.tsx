import {useSpotify} from "./hooks/useSpotfy.ts";
import { Scopes } from "@spotify/web-api-ts-sdk";
import {
    Box,
} from '@mui/material';
import MenuBar from "./components/MenuBar.tsx";
import LoginForm from "./components/LoginForm.tsx";
import {useSession} from "./providers/SessionProvider.tsx";
import SpotifySearch from "./components/SpotifySearch.tsx";

function App() {

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const session = useSession().session

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            <MenuBar/>
            {!session ? <LoginForm/> : <Box sx={{flexGrow: 1}}>
                <SpotifySearch sdk={sdk}/>
            </Box>}
        </div>
    )
}

export default App;
