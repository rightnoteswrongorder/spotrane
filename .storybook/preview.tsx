import type {Preview} from "@storybook/react";
import {ThemeProvider} from "@emotion/react";
import theme from "../src/theme";

const preview: Preview = {
    decorators: [
        (Story, {parameters}) => {
            // 👇 Make it configurable by reading the theme value from parameters
            console.log(parameters)
            return (
                <ThemeProvider theme={theme}>
                    <Story/>
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
