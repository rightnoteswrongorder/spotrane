export type SpotraneArtistDto = {
    id: string;
    name: string;
    genres?: string[];
}

export type SpotraneAlbumDto = {
    id: string;
    name: string;
    releaseDate: string;
    imageUri: string
    albumUri: string
    label?: string
    artistId?: string
}

export type SpotraneAlbumCardView = {
    id: string;
    name: string;
    releaseDate: string;
    imageUri: string
    albumUri: string
    label?: string
    artistId?: string
    artistName?: string
    artistGenres?: string
}

export type SpotraneSearchResultContainer = {
    album: SpotraneAlbumDto,
    artist: SpotraneArtistDto,
    isSaved: boolean,
    view: SpotraneAlbumCardView
}