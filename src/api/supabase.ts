import supabase from "./supaBaseClient.ts";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import {Database, Tables} from "../interfaces/database.types.ts";
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {SpotraneArtist} from "../interfaces/SpotraneArtist.ts";

export const deleteAlbum = (album: SpotraneAlbum) => {
    (async () => {
        await supabase.from('albums')
            .delete()
            .eq('id', album.id)
    })();
}

export const deleteAlbumFromList = (list: Tables<'lists'>, albumId: string) => {
    (async () => {
        const newListIds = list.albums?.filter(id => id != albumId)
        await supabase.from('lists')
            .update({albums: newListIds})
            .eq('name', list.name)
    })();
}

export const upsertArtist = async (artist: SpotraneArtist | undefined): Promise<PostgrestSingleResponse<Database['public']['Tables']['artists']['Row']> | undefined> => {
    if (artist) {
        return supabase.from('artists')
            .upsert([
                {
                    id: artist.id,
                    name: artist.name,
                    genres: artist.genres
                }
            ]).select().single();
    }
}

export const searchAllAlbums = async (searchText: string): Promise<Tables<'all_albums'>[]> => {
    const {data, error} = await supabase.rpc('search_all_albums', {keyword: searchText.replace(" ", " | ")})
    if (error) {
        console.log("Error searching all albums...")
    }
    return data
}

export const getAllAlbums = async (from: number, to: number): Promise<Tables<'all_albums'>[] | null> => {
    const {data} = await supabase
        .from('all_albums')
        .select("*")
        .range(from, to - 1)
    return data
}

export const saveAlbum = (album: SpotraneAlbum) => {
    (async () => {
        const res = await upsertArtist(album.artist);
        if (res) {
            await supabase.from('albums')
                .upsert([
                    {
                        id: album.id,
                        name: album.name,
                        artist: res.data?.id,
                        image: album.imageUri,
                        release_date: album.releaseDate,
                        label: album.label,

                    },
                ])
                .select()
        }
    })();
}

export const isSaved = (albumId: string): Promise<boolean | null> => {
    return (async () => {
        const result = await supabase
            .from('albums')
            .select("*")
            .eq('id', albumId)
        return result.data && result.data?.length > 0
    })();
}

export const addToList = (list: Tables<'lists'>, albumId: string) => {
    (async () => {
        const newListIds = [...list?.albums ?? [], albumId]
        await supabase.from('lists')
            .update({albums: newListIds})
            .eq('name', list.name)
        //}
    })();
}
