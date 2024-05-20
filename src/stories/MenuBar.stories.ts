import type {Meta, StoryObj} from "@storybook/react";
import MenuBar from "../pages/components/MenuBar.tsx";

const meta = {
    title: 'MenuBar',
    component: MenuBar,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof MenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn: Story = {
};
