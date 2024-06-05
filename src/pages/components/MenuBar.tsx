import {
    AppBar,
    Box,
    Button,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle, DarkModeOutlined, LightModeOutlined} from "@mui/icons-material";
import React, {useContext, useMemo} from "react";
import {useSession} from "../../providers/SessionProvider.tsx";
import {ThemeContext} from "../../providers/ThemeContextProvider.tsx";

type MenuBarProps = {
    logout: () => void
}

const MenuBar = ({logout} : MenuBarProps) => {
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
        logout();
        setAnchorEl(null);
    };

    const theme = useTheme();
    const { switchColorMode } = useContext(ThemeContext);
    const activateName = useMemo(
        () => (theme.palette.mode === "dark" ? "Light" : "Dark"),
        [theme]
    );

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
                        <MenuItem component={Link} href='#lists'>My Lists</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                    <Typography component="a" href='#' variant="h6" sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}>
                        spotrane
                    </Typography>
                    <Box sx={{ mt:1}}>
                        <Tooltip title={`Activate ${activateName} Mode`}>
                            <IconButton
                                onClick={switchColorMode}
                                color="inherit"
                            >
                                {theme.palette.mode === "dark" ? (
                                    <LightModeOutlined />
                                ) : (
                                    <DarkModeOutlined color="action" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {session ? <Box sx={{mt: 1}} ><Tooltip title={session.user.email}><IconButton><AccountCircle/></IconButton></Tooltip></Box> :
                        <Button color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default MenuBar