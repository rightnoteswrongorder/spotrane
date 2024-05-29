import {useSpotify} from "../hooks/useSpotfy.ts";
import {Scopes} from "@spotify/web-api-ts-sdk";
import LoginForm from "./LoginForm.tsx";
import Library from "./Library.tsx";
import PageLoadSpinner from "./components/PageLoadSpinner.tsx";
import {Session} from "@supabase/supabase-js";

type LandingProps = {
    session: Session | undefined
    loading: boolean
}
const Landing = ({session, loading} : LandingProps) => {

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    if (loading) {
        return <PageLoadSpinner/>
    } else {
        return !session ? <LoginForm/> : <Library sdk={sdk}/>
    }
}

export default Landing;
