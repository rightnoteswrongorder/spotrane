import type {Meta, StoryObj} from "@storybook/react";
import {AlbumCard} from "../pages/components/AlbumCard.tsx";
import {SpotraneAlbumCard} from "../interfaces/spotrane.types.ts";

const meta = {
    title: 'AlbumCard',
    component: AlbumCard,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AlbumCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const noargs = () => {
    alert()
}

const noop = (listId: number) => {
    alert(listId)
}

export const Minimal: Story = {
    args: {
        albumCardView:  {
            id: "1234",
            name: "Timeless",
            releaseDate: "01-01-1900",
            imageUri: "https://i.scdn.co/image/ab67616d0000b273963f6c9593ac7ed9537de5de",
            albumUri: "http://foo.png",
            label: "ECM",
            artistId: "1234",
            artistName: "John Abercrombie",
            artistGenres: ["jazz", "chamber", "european"],
            isSaved: true
        } as SpotraneAlbumCard,
        addToList: noop
    }
};
export const Full: Story = {
    args: {
        albumCardView:  {
            id: "1234",
            name: "Timeless",
            releaseDate: "01-01-1900",
            imageUri: "https://i.scdn.co/image/ab67616d0000b273963f6c9593ac7ed9537de5de",
            albumUri: "http://foo.png",
            label: "ECM",
            artistId: "1234",
            artistName: "John Abercrombie",
            artistGenres: ["jazz", "chamber", "european"],
            isSaved: true
        } as SpotraneAlbumCard,
        listVisible: true,
        addToVisibleList: noargs,
        addToList: noop,
        saveAlbum: noargs,
        deleteAlbumFromList: noargs
    }
};
