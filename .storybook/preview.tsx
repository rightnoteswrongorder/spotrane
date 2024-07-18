import type {Preview} from "@storybook/react";
import SessionProvider from "../src/stories/config/MockSessionProvider";
import {ThemeContextProvider} from "../src/providers/ThemeContextProvider";

const preview: Preview = {
    decorators: [
        (Story) => {
            // 👇 Make it configurable by reading the theme value from parameters
            return (
                <ThemeContextProvider>
                    <SessionProvider>
                        <Story/>
                    </SessionProvider>
                </ThemeContextProvider>
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
