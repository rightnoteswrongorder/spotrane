import type {Meta, StoryObj} from "@storybook/react";
import LoginForm from "../components/LoginForm.tsx";

const meta = {
    title: 'Login Form',
    component: LoginForm,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
};
