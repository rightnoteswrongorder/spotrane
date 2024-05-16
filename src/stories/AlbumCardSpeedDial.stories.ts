import type {Meta, StoryObj} from "@storybook/react";
import AlbumCardSpeedDial from "../components/AlbumCardSpeedDial.tsx";

const meta = {
    title: 'AlbumCardSpeedDial',
    component: AlbumCardSpeedDial,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AlbumCardSpeedDial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vanilla: Story = {};
