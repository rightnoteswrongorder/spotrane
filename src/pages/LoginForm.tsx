import React, {useState} from 'react'
import supabase from "../api/supaBaseClient.ts";
import {Avatar, Box, Button, TextField, Typography} from "@mui/material";
import {LockOutlined} from "@mui/icons-material";
import AlertDialog from "./components/AlertDialog.tsx";

const LoginForm =() => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()

        setLoading(true)
        const {error} = await supabase.auth.signInWithOtp({
            email, options: {
                emailRedirectTo: import.meta.env.VITE_REDIRECT_TARGET,
            }
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email for the login link!')
        }
        setLoading(false)
    }

    const onClose = () => {
        setMessage('')
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
            <Avatar sx={{m: 1, bgcolor: "primary.light"}}>
                <LockOutlined/>
            </Avatar>
            <Typography variant="h5">Login</Typography>
            <Box sx={{mt: 1}}>
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
                    sx={{mt: 3, mb: 2}}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    Login
                </Button>
            </Box>
            {message != '' && <AlertDialog message={message} onClose={onClose}/>}
        </Box>
    )
}

export default LoginForm