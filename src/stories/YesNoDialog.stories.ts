import type {Meta, StoryObj} from "@storybook/react";
import YesNoDialog from "../pages/components/YesNoDialog.tsx";

const meta = {
    title: 'YesNoDialog',
    component: YesNoDialog,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof YesNoDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {}

export const Vanilla: Story = {
    args: {
        title: "foo",
        subTitle: "bar",
        label: "baz",
        confirmEnabled: (data: string) => {console.log(data); return true},
        confirmButtonLabel: "qux",
        isOpen: true,
        handleClose: noop,
        handleSubmit: noop
    }
};