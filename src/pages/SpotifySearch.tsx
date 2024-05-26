import {useState} from 'react'
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {
    Button,
    Stack,
    TextField
} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import Grid from "@mui/material/Grid";
import {AlbumCard} from "./components/AlbumCard.tsx";
import { SpotraneAlbumCardView } from "../interfaces/SpotraneTypes.ts";
import {SpotifyApiProxy} from "../api/spotify.ts";
import {SupabaseApi} from "../api/supabase.ts";
import {Tables} from "../interfaces/database.types.ts";

interface IFormInput {
    searchText: string
}

type SpotifySearchProps = {
    sdk: SpotifyApi | null,
    list?: Tables<'lists'>
}
export default function SpotifySearch({sdk, list}: SpotifySearchProps) {
    const [searchResults, setSearchResults] = useState<SpotraneAlbumCardView[]>([]);
    const {register, handleSubmit} = useForm<IFormInput>()

    const addToList = (albumCardView: SpotraneAlbumCardView) => {
        return (list: Tables<'lists'>) => {
            list && SupabaseApi.addToListFromSearch(list, albumCardView)
        }
    }

    const addToVisibleList = (albumCardView: SpotraneAlbumCardView, list?: Tables<'lists'>,) => {
        return () => {
            list && SupabaseApi.addToListFromSearch(list, albumCardView)
        }
    }
    const saveAlbum = (albumCardView: SpotraneAlbumCardView) => {
        return () => {
            SupabaseApi.saveAlbum(albumCardView)
        }
    }

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        (async () => {
            const searchResults = await SpotifyApiProxy.searchForAlbum(sdk, data.searchText)
            if (searchResults) {

                setSearchResults(await Promise.all(searchResults.albums?.items.map(async (simplifiedAlbum) => {
                    const artist = await SpotifyApiProxy.getArtist(sdk, simplifiedAlbum.artists[0].id)
                    const album = await SpotifyApiProxy.getAlbum(sdk, simplifiedAlbum.id)
                    const isSaved = await SupabaseApi.isSaved(simplifiedAlbum.id)
                    return {
                        id: album?.id,
                        name: album?.name,
                        releaseDate: album?.release_date,
                        imageUri: album?.images[0].url,
                        albumUri: album?.uri,
                        label: album?.label,
                        artistId: artist?.id,
                        artistName: artist?.name,
                        artistGenres: artist?.genres,
                        isSaved: isSaved
                    } as SpotraneAlbumCardView
                })))
            }
        })();
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack margin={2}>
                            <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                       type='text' {...register("searchText", {required: true})} />
                            <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true} margin={2}>
                    <Grid container justifyContent="center" spacing={4}>
                        {searchResults.map((album) => (
                            <Grid item={true} key={album.id}><AlbumCard albumCardView={album}
                                                                                  addToVisibleList={addToVisibleList(album, list)}
                                                                                  addToList={addToList(album)}
                                                                                  saveAlbum={saveAlbum(album)}

                            ></AlbumCard></Grid>
                        ))} </Grid>
                </Grid>
            </Grid>
        </>
    )
}
