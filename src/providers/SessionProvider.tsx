import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";
import supabase from "../api/supaBaseClient.ts";

const defaultSessionConfig: SessionConfig = {session: undefined}

export const SessionContext = createContext<SessionConfig>(defaultSessionConfig)

type SessionConfig = {
   session: Session | undefined
}

interface Props {
    children: ReactNode;
}

const SessionProvider: React.FC<Props> = ({ children })  => {
    const [session, setSession] = useState<Session>()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if(session) {
                setSession(session)
            }
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            if(session)
                setSession(session)
        })
    }, [])


    const config: SessionConfig = {
        session: session
    }

    return (<SessionContext.Provider value={config}>
        {children}
    </SessionContext.Provider>)


}

export default SessionProvider

export const useSession = () => {
    return useContext(SessionContext)
}