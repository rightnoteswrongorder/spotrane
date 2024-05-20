import type {Meta, StoryObj} from "@storybook/react";
import CreateListDialog from "../pages/components/CreateListDialog.tsx";

const meta = {
    title: 'CreateListDialog',
    component: CreateListDialog,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof CreateListDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {}

export const Vanilla: Story = {
    args: {
        isOpen: true,
        handleAddToListDialogClose: noop
    }
};