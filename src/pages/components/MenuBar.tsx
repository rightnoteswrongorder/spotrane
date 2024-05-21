import {AppBar, Box, Button, IconButton, Link, Menu, MenuItem, Toolbar, Tooltip, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";
import {useSession} from "../../providers/SessionProvider.tsx";
import React from "react";
import {SupabaseApi} from "../../api/supabase.ts";

export default function MenuBar() {
    const session = useSession().session
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        SupabaseApi.signOut()
        setAnchorEl(null);
    };
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem component={Link} href='#'>Home</MenuItem>
                        <MenuItem component={Link} href='#library'>My Library</MenuItem>
                        <MenuItem component={Link} href='#lists'>My Lists</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                    <Typography component="a" href='/spotrane' variant="h6" sx={{
                        flexGrow: 1,
                        fontFamily: 'Helvetica',
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}>
                        spotrane
                    </Typography>
                    {session ? <Box sx={{mt: 1}} ><Tooltip title={session.user.email}><AccountCircle/></Tooltip></Box> :
                        <Button color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}