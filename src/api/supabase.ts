import supabase from "./supaBaseClient.ts";
import {Tables} from "../interfaces/database.types.ts";
import {SpotraneAlbumCard, SupabaseSatusResponse} from "../interfaces/spotrane.types.ts";

export const SupabaseApi = {
    signOut: async () => {
        await supabase.auth.signOut();
    },

    countAlbums: async (): Promise<number> => {
        const {count} = await supabase
            .from('mother_list')
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

    setRating: async (rating: number, id: string): Promise<boolean> => {
        try {
            const { error } = await supabase.from('albums')
                .update({ rating: rating })
                .eq('spotify_id', id);

            if (error) {
                console.error('Error updating rating:', error.message);
                return false;
            }

            return true;
        } catch (e) {
            console.error('Exception in setRating:', e);
            return false;
        }
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

    searchAllAlbums: async (searchText: string): Promise<Tables<'mother_list'>[]> => {
        const {data, error} = await supabase.rpc('search_all_albums',
            {keyword: searchText.replaceAll(" ", " & ")})
        if (error) {
            console.log("Error searching all albums...")
        }
        return data
    },


    getAllAlbums: async (from: number, to: number): Promise<Tables<'mother_list'>[]> => {
        const {data} = await supabase
            .from('mother_list')
            .select("*")
            .range(from, to - 1)
        return data || []
    },

    getAllArtists: async (): Promise<Tables<'artists'>[]> => {
        const {data} = await supabase
            .from('artists')
            .select("*")
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

    getAlbumsOnList: async (listName: string): Promise<Tables<'mother_list'>[] | null> => {
        const {data} = await supabase
            .from('mother_list')
            .select("*")
            .eq("list_name", listName)
        return data
    },


    getLists: async (): Promise<Tables<'lists'>[] | null> => {
        try {
            const {data, error} = await supabase
                .from('lists')
                .select('*')

            if (error) {
                console.error('Error fetching lists:', error.message);
                return null;
            }

            return data;
        } catch (e) {
            console.error('Exception in getLists:', e);
            return null;
        }
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
    },

    getRvgSeventiesBlueNotes: async (): Promise<Tables<'bluenote_rvg_seventies'>[]> => {
        const {data} = await supabase
            .from('bluenote_rvg_seventies')
            .select('*')
            .order('artist')
            .order('title')
        return data || []
    },

    getRvgImpulse: async (): Promise<Tables<'impulse_rvg'>[]> => {
        const {data} = await supabase
            .from('impulse_rvg')
            .select('*')
            .order('artist')
            .order('title')
        return data || []
    },

    getCtiImpulse: async (): Promise<Tables<'cti_rvg'>[]> => {
        const {data} = await supabase
            .from('cti_rvg')
            .select('*')
            .order('artist')
            .order('title')
        return data || []
    }
}
