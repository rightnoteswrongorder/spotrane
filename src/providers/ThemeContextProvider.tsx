import {
    StyledEngineProvider,
    ThemeProvider,
    createTheme,
} from "@mui/material/styles";
import {ReactNode, createContext, useMemo, useState} from "react";
import {CssBaseline} from "@mui/material";
import ComponentOverrides from "../theme/overrides/ComponentOverrides.ts";

type ThemeContextType = {
    switchColorMode: () => void;
};

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeContext = createContext<ThemeContextType>({
    switchColorMode: () => {
    },
});

export function ThemeContextProvider({children}: ThemeProviderProps) {
    const [mode, setMode] = useState<"light" | "dark">("dark");

    const switchColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const theme = useMemo(
        () =>
            createTheme({
                typography: {
                    fontFamily: ['Nunito', 'sans-serif'].join(','),
                },
                palette: {
                    mode,
                    primary: {
                        main: '#1db954',
                    },
                    secondary: {
                        main: '#df912c',
                    },
                },
            }),
        [mode]
    );

    theme.components = ComponentOverrides

    return (
        <StyledEngineProvider injectFirst>
            <ThemeContext.Provider value={{switchColorMode}}>
                <ThemeProvider theme={theme}>
                <CssBaseline/>
                    {children}
                </ThemeProvider>
            </ThemeContext.Provider>
        </StyledEngineProvider>
    );
}