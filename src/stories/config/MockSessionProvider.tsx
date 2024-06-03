import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";

const defaultSessionConfig: SessionConfig = {session: undefined, loading: false}

export const SessionContext = createContext<SessionConfig>(defaultSessionConfig)

type SessionConfig = {
    session: Session | undefined,
    loading: boolean
}

interface Props {
    children: ReactNode;
}

const SessionProvider: React.FC<Props> = ({children}) => {
    const [session, setSession] = useState<Session>()
    const [loading, isLoading] = useState<boolean>(true)

    useEffect(() => {
        setSession({access_token: "foo", refresh_token: "bar", expires_in: 1, token_type: "bearer", user: {
            id: "fakeid", created_at: "2134",app_metadata: {}, user_metadata: {}, aud: ""
            }})
        isLoading(false)
    }, [])


    const config: SessionConfig = {
        session: session,
        loading: loading
    }

    return (<SessionContext.Provider value={config}>
        {children}
    </SessionContext.Provider>)


}

export default SessionProvider

export const useSession = () => {
    return useContext(SessionContext)
}