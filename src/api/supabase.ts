import supabase from "./supaBaseClient.ts";
import {Tables} from "../interfaces/database.types.ts";
import {SpotraneAlbumCardView} from "../interfaces/SpotraneTypes.ts";


export const SupabaseApi = {
    signOut: () => {
        supabase.auth.signOut();
    },

    countAlbums: async (): Promise<number> => {
        const {count} = await supabase
            .from('all_albums_view')
            .select("*", {count: 'exact', head: true})
        return count || 0
    },

    deleteAlbum: (albumId: string) => {
        (async () => {
            await supabase.from('albums')
                .delete()
                .eq('spotify_id', albumId)
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

    upsertArtist: async (albumCardView: SpotraneAlbumCardView) => {
        await supabase.from('artists')
            .upsert([
                {
                    spotify_id: albumCardView.artistId,
                    name: albumCardView.artistName,
                    genres: albumCardView.artistGenres,
                }
            ], { onConflict: 'spotify_id'})
    },

    upsertAlbum: async (albumCardView: SpotraneAlbumCardView) => {
        console.log(albumCardView)
        await supabase.from('albums')
            .upsert([
                {
                    spotify_id: albumCardView.id,
                    name: albumCardView.name,
                    artist: albumCardView.artistId,
                    image: albumCardView.imageUri,
                    release_date: albumCardView.releaseDate,
                    label: albumCardView.label,
                    spotify_uri: albumCardView.albumUri

                },
            ], {onConflict: 'spotify_id'})
            .select()
    },

    searchAllAlbums: async (searchText: string): Promise<Tables<'all_albums_view'>[]> => {
        const {data, error} = await supabase.rpc('search_all_albums', {keyword: searchText.replace(" ", " | ")})
        if (error) {
            console.log("Error searching all albums...")
        }
        return data
    },

    getAllAlbums: async (from: number, to: number): Promise<Tables<'all_albums_view'>[]> => {
        const {data} = await supabase
            .from('all_albums_view')
            .select("*")
            .range(from, to - 1)
        return data || []
    },

    saveAlbum: (albumCardView: SpotraneAlbumCardView) => {
        (async () => {
            await SupabaseApi.upsertArtist(albumCardView);
            await SupabaseApi.upsertAlbum(albumCardView)
        })();
    },

    isSaved: async (albumId: string): Promise<boolean> => {
        const {data} = await supabase
            .from('albums')
            .select("*")
            .eq('spotify_id', albumId)
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

    addToListFromSearch: (list: Tables<'lists'>, albumCardView: SpotraneAlbumCardView) => {
        (async () => {
            await SupabaseApi.upsertArtist(albumCardView)
            await SupabaseApi.upsertAlbum(albumCardView)
            await supabase
                .from('list_entry')
                .insert([
                    { list_id: list.id, album_id: albumCardView.id },
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
