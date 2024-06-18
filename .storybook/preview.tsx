import type {Preview} from "@storybook/react";
import {ThemeProvider} from "@emotion/react";
import theme from "../src/theme/theme";
import SessionProvider from "../src/stories/config/MockSessionProvider";

const preview: Preview = {
    decorators: [
        (Story) => {
            // 👇 Make it configurable by reading the theme value from parameters
            return (
                <ThemeProvider theme={theme}>
                    <SessionProvider>
                        <Story/>
                    </SessionProvider>
                </ThemeProvider>
            );
        },
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
