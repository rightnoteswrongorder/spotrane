import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";
import supabase from "../api/supaBaseClient.ts";

const defaultSessionConfig: SessionConfig = {session: undefined, loading: false,  clearSession: () => {}}

export const SessionContext = createContext<SessionConfig>(defaultSessionConfig)

type SessionConfig = {
    session: Session | undefined,
    loading: boolean,
    clearSession: () => void
}

interface Props {
    children: ReactNode;
}

const SessionProvider: React.FC<Props> = ({children}) => {
    const [session, setSession] = useState<Session>()
    const [loading, isLoading] = useState<boolean>(true)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            if (session) {
                setSession(session)
            } else {
                console.log("no session found")
            }
            isLoading(false)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setSession(session)
            } else {
                console.log("no session found")
            }
            isLoading(false)
        })
    }, [])



    const config: SessionConfig = {
        session: session,
        loading: loading,
        clearSession: () => { setSession(undefined)},
    }

    return (<SessionContext.Provider value={config}>
        {children}
    </SessionContext.Provider>)


}

export default SessionProvider

export const useSession = () => {
    return useContext(SessionContext)
}