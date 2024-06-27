import supabase from "./supaBaseClient.ts";
import {Tables} from "../interfaces/database.types.ts";
import {SpotraneAlbumCard, SupabaseSatusResponse} from "../interfaces/spotrane.types.ts";

export const SupabaseApi = {
    signOut: async () => {
        await supabase.auth.signOut();
    },

    countAlbums: async (): Promise<number> => {
        const {count} = await supabase
            .from('all_albums_view')
            .select("*", {count: 'exact', head: true})
        return count || 0
    },

    getLastEntryPositionOnList: async (listId: number): Promise<number> => {
        const {data} = await supabase
            .from('list_entry')
            .select('position.max()')
            .eq('list_id', listId)
        return data ? data[0].max : 0
    },

    deleteAlbum: async (albumId: string): Promise<SupabaseSatusResponse> => {
        return supabase.from('albums')
            .delete()
            .eq('spotify_id', albumId);
    },

    deleteAlbumFromList: async (listId: number, albumId: string) => {
        await supabase.from('list_entry')
            .delete()
            .eq('list_id', listId)
            .eq('album_id', albumId)
    },

    upsertArtist: async (albumCardView: SpotraneAlbumCard) => {
        await supabase.from('artists')
            .upsert([
                {
                    spotify_id: albumCardView.artistId,
                    name: albumCardView.artistName,
                    genres: albumCardView.artistGenres,
                }
            ], {onConflict: 'spotify_id'})
    },

    upsertAlbum: async (albumCardView: SpotraneAlbumCard) => {
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

    saveAlbum: (albumCardView: SpotraneAlbumCard) => {
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

    getAlbumsOnList: async (listName: string): Promise<Tables<'albums_on_lists'>[] | null> => {
        const {data} = await supabase
            .from('albums_on_lists')
            .select("*")
            .eq("list_name", listName)
        return data
    },

    getLists: async (): Promise<Tables<'lists'>[] | null> => {
        const {data} = await supabase
            .from('lists')
            .select('*')
        return data
    },

    addToList: (listId: number, albumCardView: SpotraneAlbumCard) => {
        (async () => {
            await SupabaseApi.upsertArtist(albumCardView)
            await SupabaseApi.upsertAlbum(albumCardView)
            const position = await SupabaseApi.getLastEntryPositionOnList(listId)
            await supabase
                .from('list_entry')
                .insert([
                    {list_id: listId, album_id: albumCardView.id, position: position + 1},
                ])
        })();
    },

    createList: async (listName: string) => {
        await supabase
            .from('lists')
            .insert([
                {name: listName},
            ])
            .select()
    },

    deleteList: async (listId: number) => {
        await supabase
            .from('lists')
            .delete()
            .eq('id', listId)
    },

    renameList: async (listId: number, newName: string) => {
        await supabase
            .from('lists')
            .update({'name': newName})
            .eq('id', listId)
    },

    updateListEntryPriority: async (listEntryId: number, newPosition: number) => {
        await supabase
            .from('list_entry')
            .update({'position': newPosition})
            .eq('id', listEntryId)
    }
}
