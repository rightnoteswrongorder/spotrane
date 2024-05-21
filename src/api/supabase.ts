import supabase from "./supaBaseClient.ts";
import {Tables} from "../interfaces/database.types.ts";
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {SpotraneArtist} from "../interfaces/SpotraneArtist.ts";


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

    deleteAlbum: (album: SpotraneAlbum) => {
        (async () => {
            await supabase.from('albums')
                .delete()
                .eq('id', album.id)
        })();
    },

    deleteAlbumFromList: (list: Tables<'lists'>, albumId: string) => {
        (async () => {
            const newListIds = list.albums?.filter(id => id != albumId)
            await supabase.from('lists')
                .update({albums: newListIds})
                .eq('name', list.name)
        })();
    },

    upsertArtist: async (artist: SpotraneArtist) => {
        return supabase.from('artists')
            .upsert([
                {
                    id: artist.id,
                    name: artist.name,
                    genres: artist.genres
                }
            ]).select().single();
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

    getAlbumsByListOfIds: async (albumIds: string[]): Promise<Tables<'all_albums'>[]> => {
        const {data} = await supabase
            .from('all_albums')
            .select("*")
            .in('id', albumIds)
        return data || []
    },

    saveAlbum: (album: SpotraneAlbum) => {
        (async () => {
            album.artist && await SupabaseApi.upsertArtist(album.artist);
            await supabase.from('albums')
                .upsert([
                    {
                        id: album.id,
                        name: album.name,
                        artist: album.artist?.id,
                        image: album.imageUri,
                        release_date: album.releaseDate,
                        label: album.label,
                        spotify_uri: album.albumUri

                    },
                ])
                .select()
        })();
    },

    isSaved: (albumId: string): Promise<boolean | null> => {
        return (async () => {
            const result = await supabase
                .from('albums')
                .select("*")
                .eq('id', albumId)
            return result.data && result.data?.length > 0
        })();
    },

    getLists: async () => {
        return supabase
            .from('lists')
            .select('*')
    },

    addToList: (list: Tables<'lists'>, albumId: string) => {
        (async () => {
            const newListIds = [...list?.albums ?? [], albumId]
            await supabase.from('lists')
                .update({albums: newListIds})
                .eq('name', list.name)
            //}
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
