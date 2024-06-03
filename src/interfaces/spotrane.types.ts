export type SpotraneAlbumCard = {
    id: string;
    name: string;
    releaseDate: string;
    imageUri: string
    albumUri: string
    label: string
    artistId: string
    artistName: string
    artistGenres: string[]
    isSaved: boolean
}

export type SupabaseError = {
    details: string;
    message: string;
}

export type SupabaseSatusResponse = {
    error: SupabaseError | null,
    status: number,
    statusText: string

}