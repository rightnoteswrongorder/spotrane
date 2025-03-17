import type {Meta, StoryObj} from "@storybook/react";
import SvgTester from "../pages/components/SvgTester.tsx";

const meta = {
    title: 'SvgIcon',
    component: SvgTester,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof SvgTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vanilla: Story = {
};