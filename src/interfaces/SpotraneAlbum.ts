import {SpotraneArtist} from "./SpotraneArtist.ts";

export type SpotraneAlbum = {
    id: string;
    name: string;
    artist?: SpotraneArtist;
    releaseDate?: string;
    imageUri?: string
    albumUri?: string
    label?:string
    artistId?: string
    artistName?: string
    artistGenres?: string
    saved?: boolean
}