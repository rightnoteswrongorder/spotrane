import DraggableGrid from "./DraggableGrid.tsx";
import {SpotraneAlbumCard} from "../../../interfaces/spotrane.types.ts";
import {AlbumCard, AlbumCardProps} from "../AlbumCard.tsx";
import {ReactElement} from "react";

export type ListEntry = {
    id: number
    position: number
    item: () => ReactElement<AlbumCardProps>
}

const createAlbumCard = (id: number, imageUri: string): SpotraneAlbumCard => {
    return {
        id: String(id),
        name: "Timeless",
        releaseDate: "01-01-1900",
        imageUri: imageUri,
        albumUri: "http://foo.png",
        label: "ECM",
        artistId: "1234",
        artistName: "John Abercrombie",
        artistGenres: ["jazz", "chamber", "european"],
        isSaved: true
    } as SpotraneAlbumCard
}

const saveListEntry = (entryId: number, position: number) => {
   return ()  => {
      console.log('list entry with id ' + entryId + ' update to position ' + position);
   }

}


const defaultItems = [
    {
        id: 10,
        position: 1,
        item: () => <AlbumCard albumCardView={createAlbumCard(100, `https://picsum.photos/id/2/300/200`)} addToList={() => {}}/>
    },
    {
        id: 20,
        position: 2,
        item: () => <AlbumCard albumCardView={createAlbumCard(200, `https://picsum.photos/id/15/300/200`)} addToList={() => {}}/>
    },
    {
        id: 30,
        position: 3,
        item: () => <AlbumCard albumCardView={createAlbumCard(300, `https://picsum.photos/id/50/300/200`)} addToList={() => {}}/>
    },
    {
        id: 40,
        position: 4,
        item: () => <AlbumCard albumCardView={createAlbumCard(400, `https://picsum.photos/id/26/300/200`)} addToList={() => {}}/>
    },
]

const ListPlayground = () => {
    return <DraggableGrid start={defaultItems} save={saveListEntry}/>
}

export default ListPlayground