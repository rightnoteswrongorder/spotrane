import supabase from "./supaBaseClient.ts";
import {Tables} from "../interfaces/database.types.ts";
import {SpotraneAlbumDto, SpotraneArtistDto} from "../interfaces/SpotraneAlbum.ts";


export const SupabaseApi = {
    signOut: () => {
        supabase.auth.signOut();
    },

    countAlbums: async (): Promise<number> => {
        const {count} = await supabase
            .from('all_albums')
            .select("*", {count: 'exact', head: true})
        return count || 0
    },

    deleteAlbum: (albumId: string) => {
        (async () => {
            await supabase.from('albums')
                .delete()
                .eq('id', albumId)
        })();
    },

    deleteAlbumFromList: (list: Tables<'lists'>, albumId: string) => {
        (async () => {
            await supabase.from('list_entry')
                .delete()
                .eq('list_id', list.id)
                .eq('album_id', albumId)
        })();
    },

    upsertArtist: async (artist: SpotraneArtistDto) => {
        await supabase.from('artists')
            .upsert([
                {
                    id: artist.id,
                    name: artist.name,
                    genres: artist.genres
                }
            ])
    },

    upsertAlbum: async (album: SpotraneAlbumDto) => {
        await supabase.from('albums')
            .upsert([
                {
                    id: album.id,
                    name: album.name,
                    artist: album.artistId,
                    image: album.imageUri,
                    release_date: album.releaseDate,
                    label: album.label,
                    spotify_uri: album.albumUri

                },
            ])
            .select()
    },

    searchAllAlbums: async (searchText: string): Promise<Tables<'all_albums'>[]> => {
        const {data, error} = await supabase.rpc('search_all_albums', {keyword: searchText.replace(" ", " | ")})
        if (error) {
            console.log("Error searching all albums...")
        }
        return data
    },

    getAllAlbums: async (from: number, to: number): Promise<Tables<'all_albums'>[]> => {
        const {data} = await supabase
            .from('all_albums')
            .select("*")
            .range(from, to - 1)
        return data || []
    },

    saveAlbum: (album: SpotraneAlbumDto, artist: SpotraneArtistDto) => {
        (async () => {
            await SupabaseApi.upsertArtist(artist);
            await SupabaseApi.upsertAlbum(album)
        })();
    },

    isSaved: async (albumId: string): Promise<boolean> => {
        const {data} = await supabase
            .from('albums')
            .select("*")
            .eq('id', albumId)
        return !!(data && data.length > 0)
    },

    getAlbumsOnList: async (listName: string) : Promise<Tables<'albums_on_lists'>[] | null> => {
        const {data} = await supabase
            .from('albums_on_lists')
            .select("*")
            .eq("list_name", listName)
        return data
    },

    getLists: async () : Promise<Tables<'lists'>[] | null> => {
        const {data} = await supabase
            .from('lists')
            .select('*')
        return data
    },

    addToListFromLibrary: (list: Tables<'lists'>, albumId: string) => {
        (async () => {
            await supabase
                .from('list_entry')
                .insert([
                    { list_id: list.id, album_id: albumId },
                ])
        })();
    },

    addToListFromSearch: (list: Tables<'lists'>, artist: SpotraneArtistDto, album: SpotraneAlbumDto) => {
        (async () => {
            await SupabaseApi.upsertArtist(artist)
            await SupabaseApi.upsertAlbum(album)
            await supabase
                .from('list_entry')
                .insert([
                    { list_id: list.id, album_id: album.id },
                ])
        })();
    },

    createList: (listName: string) => {
        (async () => {
            await supabase
                .from('lists')
                .insert([
                    {name: listName},
                ])
                .select()
        })();
    }
}
