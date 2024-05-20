import type {Meta, StoryObj} from "@storybook/react";
import AddToListDialog from "../pages/components/AddToListDialog.tsx";

const meta = {
    title: 'AddToListDialog',
    component: AddToListDialog,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AddToListDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {
}

export const Vanilla: Story = {
    args: {
        isOpen: true,
        handleAddToListDialogClose: noop,
        handleAdd: noop,
        albumId: ""
    }
};