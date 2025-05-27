import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {AccountCircle, DarkModeOutlined, LightModeOutlined} from "@mui/icons-material";
import ListIcon from '@mui/icons-material/List';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import React, {useContext, useMemo} from "react";
import {useSession} from "../../providers/SessionProvider.tsx";
import {ThemeContext} from "../../providers/ThemeContextProvider.tsx";
import loginForm from "../LoginForm.tsx";

type MenuBarProps = {
    logout: () => void
}

const MenuBar = ({logout}: MenuBarProps) => {
    const {session} = useSession()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        setAnchorEl(null);
    };

    const handleLogin = () => {
        loginForm()
        setAnchorEl(null);
    };

    const theme = useTheme();
    const {switchColorMode} = useContext(ThemeContext);
    const activateName = useMemo(
        () => (theme.palette.mode === "dark" ? "Light" : "Dark"),
        [theme]
    );

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography component="a" href='#' variant="h6" sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}>
                        spotrane
                    </Typography>
                    <Box sx={{mt: 1}}>
                        <Tooltip title='Library'>
                            <IconButton
                                color="inherit"
                                href="#"
                            >
                                <LocalLibraryIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{mt: 1}}>
                        <Tooltip title='Lists'>
                            <IconButton
                                color="inherit"
                                href="#lists"
                            >
                                    <ListIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{mt: 1}}>
                        <Tooltip title='Discogs Search'>
                            <IconButton
                                color="inherit"
                                href="#discogs"
                            >
                                <Avatar>D</Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{mt: 1}}>
                        <Tooltip title={`Activate ${activateName} Mode`}>
                            <IconButton
                                onClick={switchColorMode}
                                color="inherit"
                            >
                                {theme.palette.mode === "dark" ? (
                                    <LightModeOutlined/>
                                ) : (
                                    <DarkModeOutlined color="action"/>
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{mt: 1, ml: 1}}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                            onClick={handleClick}
                        ><AccountCircle color={session ? "success" : "warning"}/></IconButton>
                        <Menu
                            id="basic-menu"
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={session ? handleLogout : handleLogin}>{session ? "Logout" : "Login"}</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default MenuBar