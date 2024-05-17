import type {Meta, StoryObj} from "@storybook/react";
import AddToListDialog from "../components/AddToListDialog.tsx";

const meta = {
    title: 'AddToListDialog',
    component: AddToListDialog,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AddToListDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vanilla: Story = {};
