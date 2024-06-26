import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {RealtimeChannel, Session} from "@supabase/supabase-js";
import supabase from "../api/supaBaseClient.ts";
import {useInterval} from "usehooks-ts";

const defaultSessionConfig: SessionConfig = {session: undefined, loading: false, clearSession: () => {}}

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


    useInterval(() => {
        const channels = supabase.getChannels();

        const reload = channels.find((channel: RealtimeChannel) => {
            return channel.state != "joined"
        })

        const status = channels.map((channel) => `Topic: ${channel.topic} State: ${channel.state}` ).join(" | ")
        console.log(status)

        if(reload) {
            console.log("1 or more websockets have disconnected - reloading")
            window.location.reload()
        }
    }, 30000)

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