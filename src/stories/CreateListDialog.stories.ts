import type {Meta, StoryObj} from "@storybook/react";
import CreateListDialog from "../components/CreateListDialog.tsx";

const meta = {
    title: 'CreateListDialog',
    component: CreateListDialog,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof CreateListDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vanilla: Story = {
    args: {
        isOpen: true,
    }
};