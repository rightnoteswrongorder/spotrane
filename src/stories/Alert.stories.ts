import type {Meta, StoryObj} from "@storybook/react";
import AlertDialog from "../pages/components/AlertDialog.tsx";

const meta = {
    title: 'AlertDialog',
    component: AlertDialog,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Vanilla: Story = {
    args: {
        message: "foo bar baz"
    }
};