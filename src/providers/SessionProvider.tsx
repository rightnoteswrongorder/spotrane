import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {RealtimeChannel, Session} from "@supabase/supabase-js";
import supabase from "../api/supaBaseClient.ts";
import {useInterval} from "usehooks-ts";

const defaultSessionConfig: SessionConfig = {session: undefined, loading: false, webSocketDisconnected: false, clearSession: () => {}}

export const SessionContext = createContext<SessionConfig>(defaultSessionConfig)

type SessionConfig = {
    session: Session | undefined,
    loading: boolean,
    webSocketDisconnected: boolean,
    clearSession: () => void
}

interface Props {
    children: ReactNode;
}

const SessionProvider: React.FC<Props> = ({children}) => {
    const [session, setSession] = useState<Session>()
    const [loading, isLoading] = useState<boolean>(true)
    const [webSocketDisconnected, isWebSocketDisconnected] = useState<boolean>(false)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            if (session) {
                setSession(session)

                supabase.channel('custom-all-channel')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'profiles' },
                        (payload) => {
                            console.log('Change received!', payload)
                        }
                    )
                    .subscribe()

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

        console.log(channels)
        console.log(status)

        if(reload || channels.length == 0) {
            //https://github.com/supabase/realtime-js/issues/121
            console.log("1 or more websockets have disconnected - fire alert")
            isWebSocketDisconnected(true)
        }
    }, 30000)

    const config: SessionConfig = {
        session: session,
        loading: loading,
        webSocketDisconnected: webSocketDisconnected,
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