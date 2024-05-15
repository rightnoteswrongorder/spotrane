import React, { useState } from 'react'
import supabase from "./supaBaseClient.ts";
import {Avatar, Box, Button, TextField, Typography} from "@mui/material";
import {LockOutlined} from "@mui/icons-material";

export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (event : React.FormEvent) => {
        event.preventDefault()

        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <Box
            sx={{
                mt: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                <LockOutlined />
            </Avatar>
            <Typography variant="h5">Login</Typography>
            <Box sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    Login
                </Button>
            </Box>
        </Box>        // <div className="row flex flex-center">
        //     <div className="col-6 form-widget">
        //         <h1 className="header">Supabase + React</h1>
        //         <p className="description">Sign in via magic link with your email below</p>
        //         <form className="form-widget" onSubmit={handleLogin}>
        //             <div>
        //                 <input
        //                     className="inputField"
        //                     type="email"
        //                     placeholder="Your email"
        //                     value={email}
        //                     required={true}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                 />
        //             </div>
        //             <div>
        //                 <button className={'button block'} disabled={loading}>
        //                     {loading ? <span>Loading</span> : <span>Send magic link</span>}
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
    )
}