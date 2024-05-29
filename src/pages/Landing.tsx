import {useSpotify} from "../hooks/useSpotfy.ts";
import {Scopes} from "@spotify/web-api-ts-sdk";
import LoginForm from "./LoginForm.tsx";
import {useSession} from "../providers/SessionProvider.tsx";
import Library from "./Library.tsx";
import PageLoadSpinner from "./components/PageLoadSpinner.tsx";

const Landing = () => {
    const {session, loading} = useSession()

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    if (loading) {
        return <PageLoadSpinner/>
    } else {
        return session ? <LoginForm/> : <Library sdk={sdk}/>
    }
}

export default Landing;