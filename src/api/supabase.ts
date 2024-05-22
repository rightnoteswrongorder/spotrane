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
        await supabase.from('artists')
            .upsert([
                {
                    id: artist.id,
                    name: artist.name,
                    genres: artist.genres
                }
            ])
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

    isSaved: async (albumId: string): Promise<boolean> => {
        const {data} = await supabase
            .from('albums')
            .select("*")
            .eq('id', albumId)
        return !!(data && data.length > 0)
    },

    getLists: async () : Promise<Tables<'lists'>[] | null> => {
        const {data} = await supabase
            .from('lists')
            .select('*')
        return data
    },

    addToList: (list: Tables<'lists'>, album: SpotraneAlbum) => {
        (async () => {
            album.artist && await SupabaseApi.upsertArtist(album.artist)
            await SupabaseApi.saveAlbum(album)
            const newListIds = [...list?.albums ?? [], album.id]
            await supabase.from('lists')
                .update({albums: newListIds})
                .eq('name', list.name)
            //}
        })();
    },

    // addToList: (list: Tables<'lists'>, albumId: string) => {
    //     (async () => {
    //         const newListIds = [...list?.albums ?? [], albumId]
    //         await supabase.from('lists')
    //             .update({albums: newListIds})
    //             .eq('name', list.name)
    //         //}
    //     })();
    // },

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
