import {Album, Artist, SearchResults, SpotifyApi} from "@spotify/web-api-ts-sdk";

export const getAlbum = async (sdk: SpotifyApi | null, albumId: string): Promise<Album | undefined> => {
    return sdk?.albums.get(albumId)
}

export const getArtist = async (sdk: SpotifyApi | null, artistId: string): Promise<Artist | undefined> => {
    return sdk?.artists.get(artistId)
}

export const searchForAlbum = async (sdk: SpotifyApi | null, searchText: string): Promise<SearchResults<readonly ["album"]> | undefined> => {
    return sdk?.search(searchText, ["album"], "GB", 5)
}
