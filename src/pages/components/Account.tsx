import React, {useState, useEffect, ReactElement} from 'react'
import supabase from "../../api/supaBaseClient.ts";
import {Session} from "@supabase/supabase-js";
interface AccountProps {
    session: Session
}
export const Account = ({session} : AccountProps ) : ReactElement => {
    const [loading, setLoading] = useState<boolean>(true)
    const [username, setUsername] = useState<string>("")
    const [website, setWebsite] = useState<string>("")

    useEffect(() => {
        let ignore = false

        async function getProfile() {
            setLoading(true)
            const {user} = session

            const {data, error} = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (!ignore) {
                if (error) {
                    console.warn(error)
                } else if (data) {
                    setUsername(data.username)
                    setWebsite(data.website)
                }
            }

            setLoading(false)
        }

        getProfile()

        return () => {
            ignore = true
        }
    }, [session])

    const updateProfile = async (event: React.FormEvent) => {
        event.preventDefault()

        setLoading(true)
        const {user} = session

        const updates = {
            id: user.id,
            username,
            website,
            updated_at: new Date(),
        }

        const {error} = await supabase.from('profiles').upsert(updates)

        if (error) {
            alert(error.message)

            setLoading(false)
        }
    }

    return (
        <form onSubmit={updateProfile} className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled/>
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                    id="username"
                    type="text"
                    required
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button className="button block primary" type="submit" disabled={loading}>
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </form>
    )
}